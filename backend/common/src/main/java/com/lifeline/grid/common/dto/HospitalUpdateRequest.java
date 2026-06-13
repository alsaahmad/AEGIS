package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record HospitalUpdateRequest(
        @JsonAlias("available_icu_beds") @NotNull @Min(0) Integer availableIcuBeds
) {}
