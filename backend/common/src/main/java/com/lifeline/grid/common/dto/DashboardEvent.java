package com.lifeline.grid.common.dto;

import java.time.Instant;
import java.util.UUID;

public record DashboardEvent(
        String type,
        UUID emergencyId,
        Object payload,
        Instant timestamp
) {
    public static DashboardEvent of(String type, UUID emergencyId, Object payload) {
        return new DashboardEvent(type, emergencyId, payload, Instant.now());
    }
}
