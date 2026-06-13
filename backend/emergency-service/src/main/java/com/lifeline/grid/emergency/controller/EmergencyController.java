package com.lifeline.grid.emergency.controller;

import com.lifeline.grid.common.dto.CreateEmergencyRequest;
import com.lifeline.grid.common.dto.EmergencyAckResponse;
import com.lifeline.grid.common.dto.EmergencyStatusUpdateRequest;
import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import com.lifeline.grid.emergency.repository.EmergencyRepository;
import com.lifeline.grid.emergency.service.EmergencyCommandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyController {
    private final EmergencyCommandService commandService;
    private final EmergencyRepository emergencyRepository;

    @PostMapping
    public ResponseEntity<EmergencyAckResponse> create(@Valid @RequestBody CreateEmergencyRequest request) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(commandService.reportEmergency(request));
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable UUID id) {
        return commandService.snapshot(commandService.get(id));
    }

    @GetMapping("/active")
    public List<Map<String, Object>> active() {
        return emergencyRepository.findByStatusNot(EmergencyStatus.COMPLETED)
                .stream()
                .map(commandService::snapshot)
                .toList();
    }

    @PostMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable UUID id,
                                            @Valid @RequestBody EmergencyStatusUpdateRequest request) {
        return commandService.snapshot(commandService.updateStatus(id, request.status(), request.details()));
    }

    @PostMapping("/{id}/arrival")
    public Map<String, Object> arrivalWebhook(@PathVariable UUID id) {
        var arrived = commandService.updateStatus(id, EmergencyStatus.ARRIVED, "Ambulance arrived at incident location.");
        return commandService.snapshot(arrived);
    }

    @PostMapping("/{id}/handoff")
    public Map<String, Object> handoffWebhook(@PathVariable UUID id) {
        var completed = commandService.updateStatus(id, EmergencyStatus.COMPLETED, "Patient handoff completed at hospital.");
        return commandService.snapshot(completed);
    }
}
