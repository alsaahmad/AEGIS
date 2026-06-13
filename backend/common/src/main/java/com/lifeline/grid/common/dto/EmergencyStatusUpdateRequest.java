package com.lifeline.grid.common.dto;

import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import jakarta.validation.constraints.NotNull;

public record EmergencyStatusUpdateRequest(
        @NotNull EmergencyStatus status,
        String details
) {}
