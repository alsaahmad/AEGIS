package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.lifeline.grid.common.entity.enums.Severity;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AmbulanceAssignmentRequest(
        @JsonAlias("emergency_id") @NotNull UUID emergencyId,
        @NotNull Severity severity,
        @JsonAlias("location_lat") @NotNull Double locationLat,
        @JsonAlias("location_lng") @NotNull Double locationLng,
        @JsonAlias("injury_type") String injuryType
) {}
