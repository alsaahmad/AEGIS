package com.lifeline.grid.workflow.repository;

import com.lifeline.grid.workflow.model.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {
  List<WorkflowStep> findByWorkflowExecutionIdOrderByStepOrder(Long workflowExecutionId);
}
