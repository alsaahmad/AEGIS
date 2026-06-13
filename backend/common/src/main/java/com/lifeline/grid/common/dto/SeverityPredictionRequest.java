package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SeverityPredictionRequest(
        @JsonProperty("victim_count") Integer victimCount,
        @JsonProperty("injury_type") String injuryType,
        @JsonProperty("incident_description") String incidentDescription
) {}
