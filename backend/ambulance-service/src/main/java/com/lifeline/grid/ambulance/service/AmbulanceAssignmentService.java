package com.lifeline.grid.ambulance.service;

import com.lifeline.grid.ambulance.repository.AmbulanceRepository;
import com.lifeline.grid.ambulance.repository.EmergencyLogRepository;
import com.lifeline.grid.ambulance.repository.EmergencyRepository;
import com.lifeline.grid.common.dto.AmbulanceAssignmentRequest;
import com.lifeline.grid.common.dto.AmbulanceAssignmentResponse;
import com.lifeline.grid.common.entity.Ambulance;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.EmergencyLog;
import com.lifeline.grid.common.entity.enums.AmbulanceStatus;
import com.lifeline.grid.common.entity.enums.EquipmentLevel;
import com.lifeline.grid.common.entity.enums.Severity;
import com.lifeline.grid.common.util.DistanceUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AmbulanceAssignmentService {
    private static final double AVG_CITY_SPEED_KMPH = 34.0;

    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyLogRepository logRepository;
    private final TrafficCongestionService trafficCongestionService;
    private final AmbulanceBroadcastService broadcaster;

    @Transactional
    public AmbulanceAssignmentResponse assign(AmbulanceAssignmentRequest request) {
        Emergency emergency = emergencyRepository.findById(request.emergencyId())
                .orElseThrow(() -> new EntityNotFoundException("Emergency not found: " + request.emergencyId()));
        List<Ambulance> candidates = ambulanceRepository.findByStatus(AmbulanceStatus.AVAILABLE);
        if (candidates.isEmpty()) throw new IllegalStateException("No available ambulances");

        RankedAmbulance best = candidates.stream()
                .map(a -> rank(a, request))
                .max(Comparator.comparingDouble(RankedAmbulance::score))
                .orElseThrow();

        Ambulance ambulance = best.ambulance();
        ambulance.setStatus(AmbulanceStatus.DISPATCHED);
        ambulanceRepository.save(ambulance);

        emergency.setAssignedAmbulance(ambulance);
        emergency.setEta(best.etaMinutes());
        emergencyRepository.save(emergency);

        logRepository.save(EmergencyLog.builder()
                .emergency(emergency)
                .eventType("AMBULANCE_DISPATCHED")
                .details("Assigned " + ambulance.getVehicleNumber() + " with score=" + round(best.score())
                        + ", eta=" + best.etaMinutes() + " minutes")
                .build());

        Map<String, Object> payload = Map.of(
                "emergencyId", request.emergencyId(),
                "ambulanceId", ambulance.getId(),
                "vehicleNumber", ambulance.getVehicleNumber(),
                "driverName", ambulance.getDriverName(),
                "driverPhone", ambulance.getDriverPhone(),
                "score", round(best.score()),
                "etaMinutes", best.etaMinutes(),
                "destination", Map.of("lat", request.locationLat(), "lng", request.locationLng()),
                "severity", request.severity()
        );
        broadcaster.driver(ambulance.getId(), payload);
        broadcaster.dashboard("AMBULANCE_ASSIGNED", request.emergencyId(), payload);

        return new AmbulanceAssignmentResponse(
                ambulance.getId(),
                ambulance.getVehicleNumber(),
                ambulance.getCurrentLat(),
                ambulance.getCurrentLng(),
                best.etaMinutes(),
                round(best.score())
        );
    }

    /**
     * Ranking score:
     *  - Distance score (Haversine)                  weight 40%
     *  - Traffic congestion factor                   weight 30%
     *  - ETA estimate                                weight 20%
     *  - Equipment match to severity                 weight 10%
     */
    public RankedAmbulance rank(Ambulance ambulance, AmbulanceAssignmentRequest request) {
        double distanceKm = DistanceUtils.haversineKm(
                ambulance.getCurrentLat(), ambulance.getCurrentLng(), request.locationLat(), request.locationLng());
        double congestion = trafficCongestionService.estimateCongestion(
                ambulance.getCurrentLat(), ambulance.getCurrentLng(), request.locationLat(), request.locationLng());
        double etaMinutes = (distanceKm / AVG_CITY_SPEED_KMPH) * 60.0 * (1.0 + congestion);

        double distanceScore = DistanceUtils.inverseScore(distanceKm, 4.0);
        double trafficScore = 1.0 - congestion;
        double etaScore = DistanceUtils.inverseScore(etaMinutes, 12.0);
        double equipmentScore = equipmentMatchScore(ambulance.getEquipmentLevel(), request.severity());

        double weightedScore = 0.40 * distanceScore
                + 0.30 * trafficScore
                + 0.20 * etaScore
                + 0.10 * equipmentScore;
        return new RankedAmbulance(ambulance, weightedScore, distanceKm, congestion, Math.max(1, (int) Math.ceil(etaMinutes)));
    }

    private double equipmentMatchScore(EquipmentLevel equipmentLevel, Severity severity) {
        if (severity == Severity.CRITICAL) {
            return equipmentLevel == EquipmentLevel.ICU ? 1.0 : equipmentLevel == EquipmentLevel.ALS ? 0.85 : 0.35;
        }
        if (severity == Severity.MEDIUM) {
            return equipmentLevel == EquipmentLevel.ICU ? 0.9 : equipmentLevel == EquipmentLevel.ALS ? 1.0 : 0.75;
        }
        return equipmentLevel == EquipmentLevel.BASIC ? 1.0 : 0.85;
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    public record RankedAmbulance(Ambulance ambulance, double score, double distanceKm, double congestion, int etaMinutes) {}
}
