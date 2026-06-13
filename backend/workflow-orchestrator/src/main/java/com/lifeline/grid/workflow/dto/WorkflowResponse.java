package com.lifeline.grid.workflow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowResponse {
  private Long workflowId;
  private String emergencyId;
  private String status;
  private String workflowType;
  private LocalDateTime startedAt;
  private LocalDateTime completedAt;
  private String result;
  private String errorMessage;
}
