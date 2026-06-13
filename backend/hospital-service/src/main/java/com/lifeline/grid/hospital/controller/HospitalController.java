package com.lifeline.grid.hospital.controller;

import com.lifeline.grid.common.dto.HospitalNotifyRequest;
import com.lifeline.grid.common.dto.HospitalUpdateRequest;
import com.lifeline.grid.hospital.repository.HospitalRepository;
import com.lifeline.grid.hospital.service.HospitalNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalRepository hospitalRepository;
    private final HospitalNotificationService hospitalNotificationService;

    @GetMapping
    public List<Map<String, Object>> all() {
        return hospitalRepository.findAll().stream().map(hospitalNotificationService::snapshot).toList();
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable UUID id, @Valid @RequestBody HospitalUpdateRequest request) {
        return hospitalNotificationService.updateBeds(id, request);
    }

    @PostMapping("/{id}/notify")
    public Map<String, Object> notify(@PathVariable UUID id, @Valid @RequestBody HospitalNotifyRequest request) {
        return hospitalNotificationService.notify(id, request);
    }
}
