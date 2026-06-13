package com.lifeline.grid.workflow.service;

import com.lifeline.grid.workflow.model.WorkflowExecution;
import com.lifeline.grid.workflow.model.WorkflowStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class WorkflowEventPublisher {

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  public void publishWorkflowStatusChange(WorkflowExecution execution) {
    Map<String, Object> event = new HashMap<>();
    event.put("workflowId", execution.getId());
    event.put("emergencyId", execution.getEmergencyId());
    event.put("status", execution.getStatus().toString());
    event.put("workflowType", execution.getType() != null ? execution.getType().toString() : "UNKNOWN");
    event.put("timestamp", System.currentTimeMillis());

    String destination = "/topic/workflow/" + execution.getEmergencyId();
    messagingTemplate.convertAndSend(destination, event);

    log.debug("Published workflow event to {}: {}", destination, event);
  }

  public void publishWorkflowCompletion(WorkflowExecution execution) {
    Map<String, Object> event = new HashMap<>();
    event.put("eventType", "WORKFLOW_COMPLETED");
    event.put("workflowId", execution.getId());
    event.put("emergencyId", execution.getEmergencyId());
    event.put("status", execution.getStatus().toString());
    event.put("completedAt", execution.getCompletedAt());
    event.put("timestamp", System.currentTimeMillis());

    String destination = "/topic/workflow-completion/" + execution.getEmergencyId();
    messagingTemplate.convertAndSend(destination, event);

    log.info("Published workflow completion event for emergencyId: {}", execution.getEmergencyId());
  }

  public void publishWorkflowFailure(WorkflowExecution execution) {
    Map<String, Object> event = new HashMap<>();
    event.put("eventType", "WORKFLOW_FAILED");
    event.put("workflowId", execution.getId());
    event.put("emergencyId", execution.getEmergencyId());
    event.put("errorMessage", execution.getErrorMessage());
    event.put("retryCount", execution.getRetryCount());
    event.put("timestamp", System.currentTimeMillis());

    String destination = "/topic/workflow-failure/" + execution.getEmergencyId();
    messagingTemplate.convertAndSend(destination, event);

    log.warn("Published workflow failure event for emergencyId: {} - {}", 
      execution.getEmergencyId(), execution.getErrorMessage());
  }

  public void publishDashboardUpdate(String emergencyId, Map<String, Object> data) {
    Map<String, Object> event = new HashMap<>(data);
    event.put("emergencyId", emergencyId);
    event.put("timestamp", System.currentTimeMillis());

    String destination = "/topic/dashboard/" + emergencyId;
    messagingTemplate.convertAndSend(destination, event);

    log.debug("Published dashboard update for emergencyId: {}", emergencyId);
  }
}
