package com.lifeline.grid.workflow.service;

import com.lifeline.grid.workflow.model.WorkflowExecution;
import com.lifeline.grid.workflow.model.WorkflowStatus;
import com.lifeline.grid.workflow.repository.WorkflowExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class WorkflowMonitoringService {

  @Autowired
  private WorkflowExecutionRepository workflowExecutionRepository;

  public Map<String, Object> getWorkflowStats() {
    long total = workflowExecutionRepository.count();
    long completed = workflowExecutionRepository.findByStatus(WorkflowStatus.COMPLETED).size();
    long failed = workflowExecutionRepository.findByStatus(WorkflowStatus.FAILED).size();
    long pending = workflowExecutionRepository.findByStatus(WorkflowStatus.PENDING).size();
    long inProgress = workflowExecutionRepository.findByStatus(WorkflowStatus.IN_PROGRESS).size();

    Map<String, Object> stats = new HashMap<>();
    stats.put("total", total);
    stats.put("completed", completed);
    stats.put("failed", failed);
    stats.put("pending", pending);
    stats.put("in_progress", inProgress);
    stats.put("success_rate", total > 0 ? (completed * 100.0 / total) : 0);
    stats.put("failure_rate", total > 0 ? (failed * 100.0 / total) : 0);
    stats.put("timestamp", LocalDateTime.now());

    return stats;
  }

  public List<Map<String, Object>> getRecentWorkflows(int limit) {
    List<WorkflowExecution> recent = workflowExecutionRepository.findAll()
      .stream()
      .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
      .limit(limit)
      .toList();

    return recent.stream().map(this::mapToDto).toList();
  }

  public List<Map<String, Object>> getFailedWorkflowsForRetry(int limit) {
    List<WorkflowExecution> failed = workflowExecutionRepository
      .findByStatusAndRetryCountLessThan(WorkflowStatus.FAILED, 3);

    return failed.stream()
      .sorted((a, b) -> a.getLastRetryAt() != null ? a.getLastRetryAt().compareTo(b.getLastRetryAt()) : 0)
      .limit(limit)
      .map(this::mapToDto)
      .toList();
  }

  public Map<String, Object> getWorkflowHealthStatus() {
    Map<String, Object> health = new HashMap<>();
    
    long total = workflowExecutionRepository.count();
    long completed = workflowExecutionRepository.findByStatus(WorkflowStatus.COMPLETED).size();
    long failed = workflowExecutionRepository.findByStatus(WorkflowStatus.FAILED).size();

    double successRate = total > 0 ? (completed * 100.0 / total) : 100;
    String status = successRate >= 95 ? "HEALTHY" : (successRate >= 80 ? "WARNING" : "CRITICAL");

    health.put("status", status);
    health.put("success_rate", successRate);
    health.put("total_workflows", total);
    health.put("completed_workflows", completed);
    health.put("failed_workflows", failed);
    health.put("timestamp", LocalDateTime.now());

    return health;
  }

  private Map<String, Object> mapToDto(WorkflowExecution execution) {
    Map<String, Object> dto = new HashMap<>();
    dto.put("id", execution.getId());
    dto.put("emergency_id", execution.getEmergencyId());
    dto.put("workflow_name", execution.getWorkflowName());
    dto.put("status", execution.getStatus().toString());
    dto.put("type", execution.getType() != null ? execution.getType().toString() : "UNKNOWN");
    dto.put("retry_count", execution.getRetryCount());
    dto.put("started_at", execution.getStartedAt());
    dto.put("completed_at", execution.getCompletedAt());
    dto.put("error_message", execution.getErrorMessage());
    dto.put("created_at", execution.getCreatedAt());
    return dto;
  }
}
