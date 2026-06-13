package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record HospitalNotifyRequest(
        @JsonAlias("emergency_id") @NotNull UUID emergencyId,
        String severity,
        @JsonAlias("injury_type") String injuryType,
        @JsonAlias("eta_minutes") Integer etaMinutes,
        @JsonAlias("ambulance_id") UUID ambulanceId
) {}
