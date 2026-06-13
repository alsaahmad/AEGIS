package com.lifeline.grid.common.dto;

import java.util.UUID;

public record AmbulanceAssignmentResponse(
        UUID ambulanceId,
        String vehicleNumber,
        Double currentLat,
        Double currentLng,
        Integer etaMinutes,
        Double score
) {}
