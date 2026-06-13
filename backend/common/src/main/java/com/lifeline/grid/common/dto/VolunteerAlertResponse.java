package com.lifeline.grid.common.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record VolunteerAlertResponse(
        UUID emergencyId,
        int notifiedCount,
        List<Map<String, Object>> volunteers
) {}
