package com.lifeline.grid.emergency.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifeline.grid.common.dto.VolunteerAlertResponse;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.Volunteer;
import com.lifeline.grid.common.util.DistanceUtils;
import com.lifeline.grid.emergency.repository.VolunteerRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VolunteerAlertService {
    private static final double VOLUNTEER_RADIUS_KM = 2.0;

    private final VolunteerRepository volunteerRepository;
    private final EmergencyCommandService commandService;
    private final WebSocketBroadcastService broadcaster;
    private final ObjectMapper objectMapper;

    private Map<String, List<String>> firstAidTips = Map.of();

    @PostConstruct
    void loadTips() {
        try (InputStream in = new ClassPathResource("first-aid-tips.json").getInputStream()) {
            firstAidTips = objectMapper.readValue(in, new TypeReference<>() {});
        } catch (Exception ex) {
            log.warn("Could not load first-aid tips; using fallback tips", ex);
            firstAidTips = Map.of("unknown", List.of("Keep the scene safe.", "Monitor breathing.", "Wait for responders."));
        }
    }

    @Transactional
    public VolunteerAlertResponse alertNearby(UUID emergencyId) {
        Emergency emergency = commandService.get(emergencyId);
        List<String> tips = tipsFor(emergency.getInjuryType());
        List<Map<String, Object>> notified = volunteerRepository.findByIsAvailableTrue().stream()
                .map(v -> Map.entry(v, DistanceUtils.haversineKm(emergency.getLocationLat(), emergency.getLocationLng(), v.getLat(), v.getLng())))
                .filter(entry -> entry.getValue() <= VOLUNTEER_RADIUS_KM)
                .map(entry -> mockPush(entry.getKey(), entry.getValue(), emergency, tips))
                .toList();
        commandService.log(emergency, "VOLUNTEERS_ALERTED", objectMapper.valueToTree(notified).toString());
        broadcaster.emergency(emergencyId, "VOLUNTEERS_ALERTED", Map.of(
                "notifiedCount", notified.size(),
                "volunteers", notified,
                "tips", tips
        ));
        return new VolunteerAlertResponse(emergencyId, notified.size(), notified);
    }

    private List<String> tipsFor(String injuryType) {
        String normalized = injuryType == null ? "unknown" : injuryType.toLowerCase(Locale.ROOT).trim();
        if (firstAidTips.containsKey(normalized)) return firstAidTips.get(normalized);
        if (normalized.contains("cardiac") || normalized.contains("chest")) return firstAidTips.getOrDefault("cardiac arrest", firstAidTips.get("unknown"));
        if (normalized.contains("burn")) return firstAidTips.getOrDefault("burns", firstAidTips.get("unknown"));
        if (normalized.contains("fracture")) return firstAidTips.getOrDefault("fracture", firstAidTips.get("unknown"));
        if (normalized.contains("bleed")) return firstAidTips.getOrDefault("bleeding", firstAidTips.get("unknown"));
        return firstAidTips.getOrDefault("unknown", List.of("Keep the scene safe."));
    }

    private Map<String, Object> mockPush(Volunteer volunteer, double distanceKm, Emergency emergency, List<String> tips) {
        String response = distanceKm < 0.8 ? "ACKNOWLEDGED" : "PENDING";
        log.info("Mock push to {}: incident={} distanceKm={} response={}", volunteer.getPhone(), emergency.getId(), distanceKm, response);
        return Map.of(
                "volunteerId", volunteer.getId(),
                "name", volunteer.getName(),
                "phone", volunteer.getPhone(),
                "distanceKm", Math.round(distanceKm * 100.0) / 100.0,
                "skills", volunteer.getSkills() == null ? "" : volunteer.getSkills(),
                "response", response,
                "firstAidTips", tips
        );
    }
}
