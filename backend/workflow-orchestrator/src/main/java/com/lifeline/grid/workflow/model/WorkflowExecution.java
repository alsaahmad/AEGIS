package com.lifeline.grid.workflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_execution")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowExecution {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String workflowName;

  @Column(nullable = false)
  private String emergencyId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WorkflowStatus status;

  @Enumerated(EnumType.STRING)
  private WorkflowType type;

  @Column(columnDefinition = "TEXT")
  private String metadata;

  private LocalDateTime startedAt;
  private LocalDateTime completedAt;

  @Column(columnDefinition = "TEXT")
  private String errorMessage;

  private Integer retryCount = 0;
  private LocalDateTime lastRetryAt;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
