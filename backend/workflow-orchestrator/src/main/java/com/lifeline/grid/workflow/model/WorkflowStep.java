package com.lifeline.grid.workflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_step")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowStep {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long workflowExecutionId;

  @Column(nullable = false)
  private String stepName;

  @Column(nullable = false)
  private Integer stepOrder;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WorkflowStatus status;

  @Column(columnDefinition = "TEXT")
  private String input;

  @Column(columnDefinition = "TEXT")
  private String output;

  private LocalDateTime startedAt;
  private LocalDateTime completedAt;

  @Column(columnDefinition = "TEXT")
  private String errorMessage;

  private String serviceName;
  private String serviceEndpoint;

  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }
}
