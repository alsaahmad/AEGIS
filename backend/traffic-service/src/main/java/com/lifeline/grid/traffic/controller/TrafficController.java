package com.lifeline.grid.traffic.controller;

import com.lifeline.grid.common.dto.CorridorActivationRequest;
import com.lifeline.grid.traffic.repository.TrafficSignalRepository;
import com.lifeline.grid.traffic.service.GreenCorridorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/traffic")
@RequiredArgsConstructor
public class TrafficController {
    private final GreenCorridorService greenCorridorService;
    private final TrafficSignalRepository signalRepository;

    @PostMapping("/activate-corridor")
    public Map<String, Object> activate(@Valid @RequestBody CorridorActivationRequest request) {
        return greenCorridorService.activate(request);
    }

    @GetMapping("/signals")
    public List<Map<String, Object>> signals() {
        return signalRepository.findAll().stream()
                .map(s -> Map.<String, Object>of(
                        "id", s.getId(),
                        "lat", s.getLat(),
                        "lng", s.getLng(),
                        "roadSegment", s.getRoadSegment(),
                        "currentState", s.getCurrentState(),
                        "controlledByCorridorId", s.getControlledByCorridorId() == null ? "" : s.getControlledByCorridorId(),
                        "priorityExpiresAt", s.getPriorityExpiresAt() == null ? "" : s.getPriorityExpiresAt()
                ))
                .toList();
    }
}
