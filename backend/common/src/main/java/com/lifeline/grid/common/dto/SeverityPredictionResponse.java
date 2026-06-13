package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SeverityPredictionResponse(
        String severity,
        Double confidence
) {}
