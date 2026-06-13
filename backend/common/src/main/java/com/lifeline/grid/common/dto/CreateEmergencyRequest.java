package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record CreateEmergencyRequest(
        @JsonAlias("citizen_id") @NotBlank String citizenId,
        @Valid @NotNull LocationDto location,
        @JsonAlias("incident_description") @NotBlank @Size(max = 2000) String incidentDescription,
        @JsonAlias("victim_count") @NotNull @Min(1) @Max(100) Integer victimCount,
        @JsonAlias("injury_type") @NotBlank String injuryType
) {}
