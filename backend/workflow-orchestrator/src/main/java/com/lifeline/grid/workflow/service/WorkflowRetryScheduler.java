package com.lifeline.grid.workflow.service;

import com.lifeline.grid.workflow.dto.WorkflowRequest;
import com.lifeline.grid.workflow.model.WorkflowExecution;
import com.lifeline.grid.workflow.model.WorkflowStatus;
import com.lifeline.grid.workflow.repository.WorkflowExecutionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class WorkflowRetryScheduler {

  @Autowired
  private WorkflowExecutionRepository workflowExecutionRepository;

  @Autowired
  private WorkflowOrchestratorService workflowOrchestratorService;

  @Value("${workflow.max.retries:3}")
  private Integer maxRetries;

  @Scheduled(fixedDelay = 30000, initialDelay = 10000)
  public void retryFailedWorkflows() {
    log.debug("Checking for failed workflows to retry...");

    List<WorkflowExecution> failedWorkflows = workflowExecutionRepository
      .findByStatusAndRetryCountLessThan(WorkflowStatus.FAILED, maxRetries);

    for (WorkflowExecution workflow : failedWorkflows) {
      log.info("Retrying failed workflow: {}", workflow.getId());

      try {
        WorkflowRequest request = WorkflowRequest.builder()
          .emergencyId(workflow.getEmergencyId())
          .emergencyData(workflow.getMetadata())
          .build();

        workflowOrchestratorService.retryFailedWorkflow(workflow.getId(), request);
      } catch (Exception e) {
        log.error("Error retrying workflow {}: {}", workflow.getId(), e.getMessage());
      }
    }
  }
}
