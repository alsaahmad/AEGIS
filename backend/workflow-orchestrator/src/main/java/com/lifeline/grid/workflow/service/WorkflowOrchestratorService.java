package com.lifeline.grid.workflow.service;

import com.lifeline.grid.workflow.dto.WorkflowRequest;
import com.lifeline.grid.workflow.dto.WorkflowResponse;
import com.lifeline.grid.workflow.model.*;
import com.lifeline.grid.workflow.repository.WorkflowExecutionRepository;
import com.lifeline.grid.workflow.repository.WorkflowStepRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class WorkflowOrchestratorService {

  @Autowired
  private WorkflowExecutionRepository workflowExecutionRepository;

  @Autowired
  private WorkflowStepRepository workflowStepRepository;

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private WorkflowEventPublisher eventPublisher;

  private final ObjectMapper objectMapper = new ObjectMapper();

  // Service endpoints configuration
  private static final Map<String, String> SERVICE_ENDPOINTS = Map.ofEntries(
    Map.entry("AI_SEVERITY", "http://localhost:8001"),
    Map.entry("ROUTE_OPTIMIZATION", "http://localhost:8002"),
    Map.entry("HOSPITAL_RECOMMENDATION", "http://localhost:8003"),
    Map.entry("EMERGENCY", "http://localhost:8081"),
    Map.entry("AMBULANCE", "http://localhost:8082"),
    Map.entry("HOSPITAL", "http://localhost:8083"),
    Map.entry("TRAFFIC", "http://localhost:8084")
  );

  public WorkflowResponse initiateEmergencyWorkflow(WorkflowRequest request) {
    log.info("Initiating emergency workflow for emergencyId: {}", request.getEmergencyId());

    WorkflowExecution execution = WorkflowExecution.builder()
      .emergencyId(request.getEmergencyId())
      .workflowName("EMERGENCY_RESPONSE_WORKFLOW")
      .type(WorkflowType.EMERGENCY_RESPONSE)
      .status(WorkflowStatus.PENDING)
      .metadata(request.getEmergencyData())
      .startedAt(LocalDateTime.now())
      .build();

    WorkflowExecution saved = workflowExecutionRepository.save(execution);

    try {
      executeWorkflowSteps(saved, request);
      return mapToResponse(saved);
    } catch (Exception e) {
      log.error("Error executing workflow for emergencyId: {}", request.getEmergencyId(), e);
      saved.setStatus(WorkflowStatus.FAILED);
      saved.setErrorMessage(e.getMessage());
      workflowExecutionRepository.save(saved);
      eventPublisher.publishWorkflowFailure(saved);
      return mapToResponse(saved);
    }
  }

  private void executeWorkflowSteps(WorkflowExecution execution, WorkflowRequest request) {
    execution.setStatus(WorkflowStatus.IN_PROGRESS);
    workflowExecutionRepository.save(execution);
    eventPublisher.publishWorkflowStatusChange(execution);

    try {
      // Step 1: AI Severity Analysis
      executeStep(execution, 1, "AI_SEVERITY_ANALYSIS", "AI_SEVERITY",
        "/api/severity/analyze", request.getEmergencyData());

      // Step 2: Route Optimization
      executeStep(execution, 2, "ROUTE_OPTIMIZATION", "ROUTE_OPTIMIZATION",
        "/api/routes/optimize", request.getEmergencyData());

      // Step 3: Hospital Recommendation
      executeStep(execution, 3, "HOSPITAL_RECOMMENDATION", "HOSPITAL_RECOMMENDATION",
        "/api/hospitals/recommend", request.getEmergencyData());

      // Step 4: Ambulance Assignment
      executeStep(execution, 4, "AMBULANCE_ASSIGNMENT", "AMBULANCE",
        "/api/ambulances/assign", request.getEmergencyData());

      // Step 5: Hospital Notification
      executeStep(execution, 5, "HOSPITAL_NOTIFICATION", "HOSPITAL",
        "/api/hospitals/notify", request.getEmergencyData());

      // Step 6: Traffic Coordination
      executeStep(execution, 6, "TRAFFIC_COORDINATION", "TRAFFIC",
        "/api/traffic/corridor/activate", request.getEmergencyData());

      execution.setStatus(WorkflowStatus.COMPLETED);
      execution.setCompletedAt(LocalDateTime.now());
      workflowExecutionRepository.save(execution);
      eventPublisher.publishWorkflowCompletion(execution);
      log.info("Workflow completed successfully for emergencyId: {}", execution.getEmergencyId());
    } catch (Exception e) {
      log.error("Error in workflow steps for emergencyId: {}", execution.getEmergencyId(), e);
      execution.setStatus(WorkflowStatus.FAILED);
      execution.setErrorMessage(e.getMessage());
      workflowExecutionRepository.save(execution);
      eventPublisher.publishWorkflowFailure(execution);
      throw e;
    }
  }

  private void executeStep(WorkflowExecution execution, int stepOrder, String stepName,
                           String serviceName, String endpoint, String input) {
    WorkflowStep step = WorkflowStep.builder()
      .workflowExecutionId(execution.getId())
      .stepName(stepName)
      .stepOrder(stepOrder)
      .status(WorkflowStatus.IN_PROGRESS)
      .input(input)
      .serviceName(serviceName)
      .serviceEndpoint(endpoint)
      .startedAt(LocalDateTime.now())
      .build();

    try {
      String baseUrl = SERVICE_ENDPOINTS.getOrDefault(serviceName, "http://localhost:8080");
      String fullUrl = baseUrl + endpoint;

      log.info("Calling service {} at {}", serviceName, fullUrl);

      Map<String, Object> requestBody = new HashMap<>();
      requestBody.put("emergencyId", execution.getEmergencyId());
      requestBody.put("data", input);

      Object response = restTemplate.postForObject(fullUrl, requestBody, Object.class);
      step.setOutput(objectMapper.writeValueAsString(response));
      step.setStatus(WorkflowStatus.COMPLETED);
      step.setCompletedAt(LocalDateTime.now());

      log.info("Step {} completed successfully", stepName);
    } catch (Exception e) {
      log.error("Error executing step {}: {}", stepName, e.getMessage(), e);
      step.setStatus(WorkflowStatus.FAILED);
      step.setErrorMessage(e.getMessage());
      step.setCompletedAt(LocalDateTime.now());
    }

    workflowStepRepository.save(step);
  }

  public WorkflowResponse getWorkflowStatus(String emergencyId) {
    Optional<WorkflowExecution> execution = workflowExecutionRepository.findByEmergencyId(emergencyId);
    if (execution.isPresent()) {
      return mapToResponse(execution.get());
    }
    throw new RuntimeException("Workflow not found for emergencyId: " + emergencyId);
  }

  public List<WorkflowResponse> getFailedWorkflows() {
    List<WorkflowExecution> failed = workflowExecutionRepository.findByStatus(WorkflowStatus.FAILED);
    return failed.stream().map(this::mapToResponse).toList();
  }

  public void retryFailedWorkflow(Long workflowId, WorkflowRequest request) {
    Optional<WorkflowExecution> executionOpt = workflowExecutionRepository.findById(workflowId);
    if (executionOpt.isPresent()) {
      WorkflowExecution execution = executionOpt.get();
      execution.setStatus(WorkflowStatus.RETRY_PENDING);
      execution.setRetryCount(execution.getRetryCount() + 1);
      execution.setLastRetryAt(LocalDateTime.now());
      workflowExecutionRepository.save(execution);

      try {
        executeWorkflowSteps(execution, request);
      } catch (Exception e) {
        log.error("Retry failed for workflowId: {}", workflowId, e);
        execution.setStatus(WorkflowStatus.FAILED);
        execution.setErrorMessage("Retry failed: " + e.getMessage());
        workflowExecutionRepository.save(execution);
      }
    }
  }

  private WorkflowResponse mapToResponse(WorkflowExecution execution) {
    return WorkflowResponse.builder()
      .workflowId(execution.getId())
      .emergencyId(execution.getEmergencyId())
      .status(execution.getStatus().toString())
      .workflowType(execution.getType() != null ? execution.getType().toString() : "UNKNOWN")
      .startedAt(execution.getStartedAt())
      .completedAt(execution.getCompletedAt())
      .errorMessage(execution.getErrorMessage())
      .build();
  }
}
