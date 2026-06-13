package com.lifeline.grid.common.dto;

import java.util.UUID;

public record HospitalDto(
        UUID id,
        String name,
        Double lat,
        Double lng,
        Integer totalIcuBeds,
        Integer availableIcuBeds,
        String specializations,
        String phone,
        Double currentLoadPct
) {}
