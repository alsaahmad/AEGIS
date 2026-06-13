package com.lifeline.grid.workflow.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowRequest {
  private String emergencyId;
  private String workflowType;
  private String emergencyData;
  private String severity;
  private String location;
  private String description;
}
