package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CorridorActivationRequest(
        @JsonAlias("emergency_id") @NotNull UUID emergencyId,
        @JsonAlias("traffic_signal_ids") @NotEmpty List<UUID> trafficSignalIds,
        @JsonAlias("predicted_arrival_seconds") @NotNull Integer predictedArrivalSeconds
) {}
