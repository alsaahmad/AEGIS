package com.lifeline.grid.ambulance.controller;

import com.lifeline.grid.ambulance.repository.AmbulanceRepository;
import com.lifeline.grid.ambulance.service.AmbulanceAssignmentService;
import com.lifeline.grid.ambulance.service.AmbulanceBroadcastService;
import com.lifeline.grid.common.dto.AmbulanceAssignmentRequest;
import com.lifeline.grid.common.dto.AmbulanceAssignmentResponse;
import com.lifeline.grid.common.dto.AmbulanceLocationUpdateRequest;
import com.lifeline.grid.common.entity.Ambulance;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ambulances")
@RequiredArgsConstructor
public class AmbulanceController {
    private final AmbulanceRepository ambulanceRepository;
    private final AmbulanceAssignmentService assignmentService;
    private final AmbulanceBroadcastService broadcaster;

    @GetMapping
    public List<Map<String, Object>> all() {
        return ambulanceRepository.findAll().stream().map(this::snapshot).toList();
    }

    @PostMapping("/assign")
    public AmbulanceAssignmentResponse assign(@Valid @RequestBody AmbulanceAssignmentRequest request) {
        return assignmentService.assign(request);
    }

    @PostMapping("/{id}/location")
    public Map<String, Object> updateLocation(@PathVariable UUID id,
                                              @Valid @RequestBody AmbulanceLocationUpdateRequest request) {
        Ambulance ambulance = ambulanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ambulance not found: " + id));
        ambulance.setCurrentLat(request.lat());
        ambulance.setCurrentLng(request.lng());
        ambulanceRepository.save(ambulance);

        Map<String, Object> payload = snapshot(ambulance);
        broadcaster.location(id, payload);
        return payload;
    }

    private Map<String, Object> snapshot(Ambulance ambulance) {
        return Map.of(
                "id", ambulance.getId(),
                "vehicleNumber", ambulance.getVehicleNumber(),
                "lat", ambulance.getCurrentLat(),
                "lng", ambulance.getCurrentLng(),
                "status", ambulance.getStatus(),
                "driverName", ambulance.getDriverName() == null ? "" : ambulance.getDriverName(),
                "driverPhone", ambulance.getDriverPhone() == null ? "" : ambulance.getDriverPhone(),
                "equipmentLevel", ambulance.getEquipmentLevel(),
                "updatedAt", ambulance.getUpdatedAt() == null ? Instant.now() : ambulance.getUpdatedAt()
        );
    }
}
