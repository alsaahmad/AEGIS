package com.lifeline.grid.emergency.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifeline.grid.common.dto.*;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import com.lifeline.grid.common.entity.enums.Severity;
import com.lifeline.grid.emergency.event.EmergencyCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.InputStream;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyOrchestrator {
    private final EmergencyCommandService commandService;
    private final SeverityClient severityClient;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    private final WebSocketBroadcastService broadcaster;

    @Value("${services.ambulance-url}") private String ambulanceUrl;
    @Value("${services.route-url}") private String routeUrl;
    @Value("${services.traffic-url}") private String trafficUrl;
    @Value("${services.hospital-recommendation-url}") private String hospitalRecommendationUrl;
    @Value("${services.hospital-url}") private String hospitalUrl;

    /**
     * Sequence diagram for one MVP emergency:
     * Citizen App -> EmergencyService: POST /api/v1/emergencies
     * EmergencyService -> DB: INSERT emergency(status=REPORTED)
     * EmergencyService -> WebSocket: /topic/dashboard EMERGENCY_REPORTED
     * EmergencyService -> SeverityAI: POST /predict/severity
     * EmergencyService -> DB/WebSocket: severity + SEVERITY_ASSESSED
     * EmergencyService -> AmbulanceService: POST /api/v1/ambulances/assign
     * AmbulanceService -> DB/WebSocket: ambulance DISPATCHED + assignment event
     * EmergencyService -> DB/WebSocket: AMBULANCE_ASSIGNED
     * EmergencyService -> RouteService: POST /optimize/route
     * EmergencyService -> TrafficService: POST /api/v1/traffic/activate-corridor
     * TrafficService -> DB/WebSocket: signals GREEN_PRIORITY
     * EmergencyService -> DB/WebSocket: EN_ROUTE
     * EmergencyService -> HospitalRecommendation: POST /recommend/hospital
     * EmergencyService -> HospitalService: POST /api/v1/hospitals/{id}/notify
     * HospitalService -> DB/WebSocket: ICU bed reserved + hospital alert
     * EmergencyService -> DB/WebSocket: HOSPITAL_NOTIFIED
     * Ambulance App -> EmergencyService: POST /api/v1/emergencies/{id}/arrival
     * EmergencyService -> DB/WebSocket: ARRIVED -> COMPLETED on handoff
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void orchestrate(EmergencyCreatedEvent event) {
        UUID emergencyId = event.emergencyId();
        try {
            Emergency emergency = commandService.get(emergencyId);

            SeverityPredictionResponse ai = predictSeverityWithFallback(emergency);
            Severity severity = Severity.valueOf(ai.severity().toUpperCase(Locale.ROOT));
            commandService.updateSeverity(emergencyId, severity, ai.confidence());

            AmbulanceAssignmentResponse assignment = assignAmbulance(emergencyId, severity, emergency);
            commandService.assignAmbulance(emergencyId, assignment.ambulanceId(), assignment.etaMinutes());

            Map<String, Object> route = optimizeRouteToIncident(assignment, emergency);
            List<UUID> signalIds = activateGreenCorridor(emergencyId, route, Math.max(assignment.etaMinutes(), 1) * 60);
            broadcaster.dashboard("GREEN_CORRIDOR_ACTIVATED", emergencyId, Map.of(
                    "emergencyId", emergencyId,
                    "trafficSignalIds", signalIds,
                    "state", "GREEN_PRIORITY"
            ));
            commandService.updateStatus(emergencyId, EmergencyStatus.EN_ROUTE,
                    "Ambulance dispatched. Green corridor activated for predicted route.");

            Map<String, Object> hospital = recommendHospital(severity, emergency, assignment);
            UUID hospitalId = UUID.fromString(String.valueOf(hospital.get("id")));
            commandService.assignHospital(emergencyId, hospitalId);
            Map<String, Object> hospitalAlert = notifyHospital(hospitalId, emergencyId, severity, emergency, assignment);
            broadcaster.dashboard("HOSPITAL_NOTIFIED", emergencyId, hospitalAlert);
            commandService.updateStatus(emergencyId, EmergencyStatus.HOSPITAL_NOTIFIED,
                    "Hospital notified and ICU capacity reserved.");
        } catch (Exception ex) {
            log.error("Emergency orchestration failed for {}", emergencyId, ex);
            try {
                commandService.updateStatus(emergencyId, EmergencyStatus.FAILED,
                        "Orchestration failed: " + ex.getMessage());
            } catch (Exception ignored) {
                log.error("Could not mark emergency {} as FAILED", emergencyId, ignored);
            }
        }
    }

    private SeverityPredictionResponse predictSeverityWithFallback(Emergency emergency) {
        try {
            SeverityPredictionResponse response = severityClient.predict(new SeverityPredictionRequest(
                    emergency.getVictimCount(),
                    emergency.getInjuryType(),
                    emergency.getDescription()
            ));
            if (response != null) return response;
        } catch (Exception ex) {
            log.warn("Using fallback MEDIUM severity for emergency {} due to AI error: {}", emergency.getId(), ex.getMessage());
        }
        // Fail-safe rollback strategy for hackathon MVP: never block dispatch because AI is down.
        return new SeverityPredictionResponse("MEDIUM", 0.55);
    }

    private AmbulanceAssignmentResponse assignAmbulance(UUID emergencyId, Severity severity, Emergency emergency) {
        AmbulanceAssignmentRequest request = new AmbulanceAssignmentRequest(
                emergencyId,
                severity,
                emergency.getLocationLat(),
                emergency.getLocationLng(),
                emergency.getInjuryType()
        );
        return webClientBuilder.baseUrl(ambulanceUrl).build().post()
                .uri("/api/v1/ambulances/assign")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AmbulanceAssignmentResponse.class)
                .timeout(Duration.ofSeconds(5))
                .block();
    }

    private Map<String, Object> optimizeRouteToIncident(AmbulanceAssignmentResponse assignment, Emergency emergency) throws Exception {
        Map<String, Object> road = readDemoRoadNetwork();
        Object graph = Map.of("nodes", road.get("nodes"), "edges", road.get("edges"));
        Map<String, Object> request = Map.of(
                "start", Map.of("lat", assignment.currentLat(), "lng", assignment.currentLng()),
                "end", Map.of("lat", emergency.getLocationLat(), "lng", emergency.getLocationLng()),
                "algorithm", "astar",
                "average_speed_kmph", 42,
                "graph", graph
        );
        return webClientBuilder.baseUrl(routeUrl).build().post()
                .uri("/optimize/route")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {})
                .timeout(Duration.ofSeconds(5))
                .block();
    }

    @SuppressWarnings("unchecked")
    private List<UUID> activateGreenCorridor(UUID emergencyId, Map<String, Object> route, int arrivalSeconds) {
        List<String> signalStrings = (List<String>) route.getOrDefault("traffic_signal_ids", List.of());
        List<UUID> signalIds = signalStrings.stream().map(UUID::fromString).distinct().toList();
        if (signalIds.isEmpty()) return List.of();
        CorridorActivationRequest request = new CorridorActivationRequest(emergencyId, signalIds, arrivalSeconds);
        webClientBuilder.baseUrl(trafficUrl).build().post()
                .uri("/api/v1/traffic/activate-corridor")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(5))
                .block();
        return signalIds;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> recommendHospital(Severity severity, Emergency emergency, AmbulanceAssignmentResponse assignment) {
        Map<String, Object> request = Map.of(
                "severity", severity.name(),
                "required_specialization", deriveSpecialization(emergency.getInjuryType()),
                "ambulance_location", Map.of("lat", assignment.currentLat(), "lng", assignment.currentLng())
        );
        Map<String, Object> response = webClientBuilder.baseUrl(hospitalRecommendationUrl).build().post()
                .uri("/recommend/hospital")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {})
                .timeout(Duration.ofSeconds(5))
                .block();
        List<Map<String, Object>> top = (List<Map<String, Object>>) response.getOrDefault("top_hospitals", List.of());
        if (top.isEmpty()) throw new IllegalStateException("No hospital recommendation returned");
        return top.get(0);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> notifyHospital(UUID hospitalId, UUID emergencyId, Severity severity, Emergency emergency, AmbulanceAssignmentResponse assignment) {
        HospitalNotifyRequest request = new HospitalNotifyRequest(
                emergencyId,
                severity.name(),
                emergency.getInjuryType(),
                assignment.etaMinutes(),
                assignment.ambulanceId()
        );
        return webClientBuilder.baseUrl(hospitalUrl).build().post()
                .uri("/api/v1/hospitals/{id}/notify", hospitalId)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {})
                .timeout(Duration.ofSeconds(5))
                .block();
    }

    private Map<String, Object> readDemoRoadNetwork() throws Exception {
        try (InputStream in = new ClassPathResource("demo-road-network.json").getInputStream()) {
            return objectMapper.readValue(in, new TypeReference<>() {});
        }
    }

    private String deriveSpecialization(String injuryType) {
        String t = injuryType == null ? "general" : injuryType.toLowerCase(Locale.ROOT);
        if (t.contains("cardiac") || t.contains("chest") || t.contains("heart")) return "cardiac";
        if (t.contains("burn")) return "burns";
        if (t.contains("fracture") || t.contains("bleeding") || t.contains("accident") || t.contains("trauma")) return "trauma";
        return "general";
    }
}
