package com.lifeline.grid.common.dto;

import java.time.Instant;
import java.util.UUID;

public record EmergencyAckResponse(
        UUID emergencyId,
        String status,
        String message,
        Instant createdAt
) {}
