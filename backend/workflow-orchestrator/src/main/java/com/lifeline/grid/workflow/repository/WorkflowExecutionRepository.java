package com.lifeline.grid.workflow.repository;

import com.lifeline.grid.workflow.model.WorkflowExecution;
import com.lifeline.grid.workflow.model.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowExecutionRepository extends JpaRepository<WorkflowExecution, Long> {
  Optional<WorkflowExecution> findByEmergencyId(String emergencyId);
  List<WorkflowExecution> findByStatus(WorkflowStatus status);
  List<WorkflowExecution> findByStatusAndRetryCountLessThan(WorkflowStatus status, Integer maxRetries);
}
