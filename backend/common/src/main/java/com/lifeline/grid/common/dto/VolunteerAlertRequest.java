package com.lifeline.grid.common.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record VolunteerAlertRequest(@JsonAlias("emergency_id") @NotNull UUID emergencyId) {}
