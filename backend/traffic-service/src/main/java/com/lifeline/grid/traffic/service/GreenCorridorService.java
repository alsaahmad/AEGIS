package com.lifeline.grid.traffic.service;

import com.lifeline.grid.common.dto.CorridorActivationRequest;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.EmergencyLog;
import com.lifeline.grid.common.entity.TrafficSignal;
import com.lifeline.grid.common.entity.enums.TrafficSignalState;
import com.lifeline.grid.traffic.repository.EmergencyLogRepository;
import com.lifeline.grid.traffic.repository.EmergencyRepository;
import com.lifeline.grid.traffic.repository.TrafficSignalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GreenCorridorService {
    private final TrafficSignalRepository signalRepository;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyLogRepository logRepository;
    private final TrafficBroadcastService broadcaster;

    @Transactional
    public Map<String, Object> activate(CorridorActivationRequest request) {
        Emergency emergency = emergencyRepository.findById(request.emergencyId())
                .orElseThrow(() -> new EntityNotFoundException("Emergency not found: " + request.emergencyId()));
        Instant revertAt = Instant.now().plusSeconds(request.predictedArrivalSeconds() + 45L);
        List<TrafficSignal> signals = signalRepository.findAllById(request.trafficSignalIds());
        if (signals.isEmpty()) throw new IllegalArgumentException("No valid traffic signals provided");

        signals.forEach(signal -> {
            signal.setCurrentState(TrafficSignalState.GREEN_PRIORITY);
            signal.setControlledByCorridorId(request.emergencyId());
            signal.setPriorityExpiresAt(revertAt);
        });
        signalRepository.saveAll(signals);

        logRepository.save(EmergencyLog.builder()
                .emergency(emergency)
                .eventType("GREEN_CORRIDOR_ACTIVATED")
                .details("Activated " + signals.size() + " signals until " + revertAt)
                .build());

        Map<String, Object> payload = Map.of(
                "emergencyId", request.emergencyId(),
                "trafficSignalIds", signals.stream().map(TrafficSignal::getId).toList(),
                "state", TrafficSignalState.GREEN_PRIORITY,
                "revertAt", revertAt
        );
        broadcaster.dashboard("GREEN_CORRIDOR_ACTIVATED", request.emergencyId(), payload);
        return payload;
    }

    @Transactional
    @Scheduled(fixedDelay = 5000)
    public void revertExpiredCorridors() {
        List<TrafficSignal> expired = signalRepository.findByCurrentStateAndPriorityExpiresAtBefore(
                TrafficSignalState.GREEN_PRIORITY, Instant.now());
        if (expired.isEmpty()) return;
        expired.forEach(signal -> {
            signal.setCurrentState(TrafficSignalState.RED);
            signal.setControlledByCorridorId(null);
            signal.setPriorityExpiresAt(null);
        });
        signalRepository.saveAll(expired);
        broadcaster.dashboard("GREEN_CORRIDOR_REVERTED", null,
                Map.of("trafficSignalIds", expired.stream().map(TrafficSignal::getId).toList()));
    }
}
