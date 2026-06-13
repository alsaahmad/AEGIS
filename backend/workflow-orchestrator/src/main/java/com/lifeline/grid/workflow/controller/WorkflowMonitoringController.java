package com.lifeline.grid.workflow.controller;

import com.lifeline.grid.workflow.service.WorkflowMonitoringService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workflow/monitoring")
@Slf4j
@CrossOrigin(origins = "*")
public class WorkflowMonitoringController {

  @Autowired
  private WorkflowMonitoringService monitoringService;

  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> getWorkflowStats() {
    try {
      Map<String, Object> stats = monitoringService.getWorkflowStats();
      return ResponseEntity.ok(stats);
    } catch (Exception e) {
      log.error("Error retrieving workflow stats", e);
      return ResponseEntity.internalServerError().build();
    }
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, Object>> getHealthStatus() {
    try {
      Map<String, Object> health = monitoringService.getWorkflowHealthStatus();
      return ResponseEntity.ok(health);
    } catch (Exception e) {
      log.error("Error retrieving health status", e);
      return ResponseEntity.internalServerError().build();
    }
  }

  @GetMapping("/recent")
  public ResponseEntity<List<Map<String, Object>>> getRecentWorkflows(
    @RequestParam(defaultValue = "10") int limit) {
    try {
      List<Map<String, Object>> workflows = monitoringService.getRecentWorkflows(limit);
      return ResponseEntity.ok(workflows);
    } catch (Exception e) {
      log.error("Error retrieving recent workflows", e);
      return ResponseEntity.internalServerError().build();
    }
  }

  @GetMapping("/failed-retry-candidates")
  public ResponseEntity<List<Map<String, Object>>> getFailedWorkflowsForRetry(
    @RequestParam(defaultValue = "10") int limit) {
    try {
      List<Map<String, Object>> workflows = monitoringService.getFailedWorkflowsForRetry(limit);
      return ResponseEntity.ok(workflows);
    } catch (Exception e) {
      log.error("Error retrieving failed workflows", e);
      return ResponseEntity.internalServerError().build();
    }
  }
}
