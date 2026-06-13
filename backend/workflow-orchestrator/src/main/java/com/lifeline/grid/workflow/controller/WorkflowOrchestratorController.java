package com.lifeline.grid.workflow.controller;

import com.lifeline.grid.workflow.dto.WorkflowRequest;
import com.lifeline.grid.workflow.dto.WorkflowResponse;
import com.lifeline.grid.workflow.service.WorkflowOrchestratorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflow")
@Slf4j
@CrossOrigin(origins = "*")
public class WorkflowOrchestratorController {

  @Autowired
  private WorkflowOrchestratorService workflowOrchestratorService;

  @PostMapping("/emergency")
  public ResponseEntity<WorkflowResponse> initiateEmergencyWorkflow(@RequestBody WorkflowRequest request) {
    log.info("Received emergency workflow request for emergencyId: {}", request.getEmergencyId());
    try {
      WorkflowResponse response = workflowOrchestratorService.initiateEmergencyWorkflow(request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error initiating workflow", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/status/{emergencyId}")
  public ResponseEntity<WorkflowResponse> getWorkflowStatus(@PathVariable String emergencyId) {
    try {
      WorkflowResponse response = workflowOrchestratorService.getWorkflowStatus(emergencyId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Error retrieving workflow status", e);
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @GetMapping("/failed")
  public ResponseEntity<List<WorkflowResponse>> getFailedWorkflows() {
    try {
      List<WorkflowResponse> responses = workflowOrchestratorService.getFailedWorkflows();
      return ResponseEntity.ok(responses);
    } catch (Exception e) {
      log.error("Error retrieving failed workflows", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/retry/{workflowId}")
  public ResponseEntity<Void> retryWorkflow(@PathVariable Long workflowId, @RequestBody WorkflowRequest request) {
    try {
      workflowOrchestratorService.retryFailedWorkflow(workflowId, request);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("Error retrying workflow", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/health")
  public ResponseEntity<String> health() {
    return ResponseEntity.ok("Workflow Orchestrator Service is running");
  }
}
