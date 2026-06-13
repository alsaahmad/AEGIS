package com.lifeline.grid.emergency.service;

import com.lifeline.grid.common.dto.CreateEmergencyRequest;
import com.lifeline.grid.common.dto.EmergencyAckResponse;
import com.lifeline.grid.common.entity.Ambulance;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.EmergencyLog;
import com.lifeline.grid.common.entity.Hospital;
import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import com.lifeline.grid.common.entity.enums.Severity;
import com.lifeline.grid.emergency.event.EmergencyCreatedEvent;
import com.lifeline.grid.emergency.repository.EmergencyLogRepository;
import com.lifeline.grid.emergency.repository.EmergencyRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmergencyCommandService {
    private final EmergencyRepository emergencyRepository;
    private final EmergencyLogRepository logRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final WebSocketBroadcastService broadcaster;
    private final EntityManager entityManager;

    @Transactional
    public EmergencyAckResponse reportEmergency(CreateEmergencyRequest request) {
        Emergency emergency = Emergency.builder()
                .citizenId(request.citizenId())
                .locationLat(request.location().lat())
                .locationLng(request.location().lng())
                .description(request.incidentDescription())
                .victimCount(request.victimCount())
                .injuryType(request.injuryType().toLowerCase())
                .severity(Severity.UNKNOWN)
                .status(EmergencyStatus.REPORTED)
                .build();
        emergency = emergencyRepository.save(emergency);
        log(emergency, "SOS_REPORTED", "Citizen SOS submitted; async AI severity assessment queued.");
        broadcaster.emergency(emergency.getId(), "EMERGENCY_REPORTED", snapshot(emergency));
        eventPublisher.publishEvent(new EmergencyCreatedEvent(emergency.getId()));
        return new EmergencyAckResponse(
                emergency.getId(),
                emergency.getStatus().name(),
                "Emergency reported. LifeLine AI is assessing severity and dispatching help.",
                emergency.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public Emergency get(UUID id) {
        return emergencyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Emergency not found: " + id));
    }

    @Transactional
    public Emergency updateSeverity(UUID id, Severity severity, double confidence) {
        Emergency emergency = getForUpdate(id);
        emergency.setSeverity(severity);
        emergency.setStatus(EmergencyStatus.SEVERITY_ASSESSED);
        log(emergency, "SEVERITY_ASSESSED", "AI severity=" + severity + ", confidence=" + confidence);
        broadcaster.emergency(id, "SEVERITY_ASSESSED", snapshot(emergency, Map.of("confidence", confidence)));
        return emergency;
    }

    @Transactional
    public Emergency assignAmbulance(UUID emergencyId, UUID ambulanceId, Integer etaMinutes) {
        Emergency emergency = getForUpdate(emergencyId);
        emergency.setAssignedAmbulance(entityManager.getReference(Ambulance.class, ambulanceId));
        emergency.setEta(etaMinutes);
        emergency.setStatus(EmergencyStatus.AMBULANCE_ASSIGNED);
        log(emergency, "AMBULANCE_ASSIGNED", "Ambulance " + ambulanceId + " assigned. ETA=" + etaMinutes + " minutes");
        broadcaster.emergency(emergencyId, "AMBULANCE_ASSIGNED", snapshot(emergency));
        return emergency;
    }

    @Transactional
    public Emergency assignHospital(UUID emergencyId, UUID hospitalId) {
        Emergency emergency = getForUpdate(emergencyId);
        emergency.setAssignedHospital(entityManager.getReference(Hospital.class, hospitalId));
        log(emergency, "HOSPITAL_SELECTED", "Hospital " + hospitalId + " selected by recommendation engine.");
        broadcaster.emergency(emergencyId, "HOSPITAL_SELECTED", snapshot(emergency));
        return emergency;
    }

    @Transactional
    public Emergency updateStatus(UUID id, EmergencyStatus status, String details) {
        Emergency emergency = getForUpdate(id);
        emergency.setStatus(status);
        log(emergency, status.name(), details == null ? "Status changed to " + status : details);
        broadcaster.emergency(id, status.name(), snapshot(emergency, Map.of("details", details == null ? "" : details)));
        return emergency;
    }

    public Map<String, Object> snapshot(Emergency emergency) {
        return snapshot(emergency, Map.of());
    }

    public Map<String, Object> snapshot(Emergency emergency, Map<String, Object> extra) {
        UUID ambulanceId = emergency.getAssignedAmbulance() == null ? null : emergency.getAssignedAmbulance().getId();
        UUID hospitalId = emergency.getAssignedHospital() == null ? null : emergency.getAssignedHospital().getId();
        java.util.HashMap<String, Object> map = new java.util.HashMap<>();
        map.put("id", emergency.getId());
        map.put("citizenId", emergency.getCitizenId());
        map.put("lat", emergency.getLocationLat());
        map.put("lng", emergency.getLocationLng());
        map.put("description", emergency.getDescription());
        map.put("victimCount", emergency.getVictimCount());
        map.put("injuryType", emergency.getInjuryType());
        map.put("severity", emergency.getSeverity());
        map.put("status", emergency.getStatus());
        map.put("assignedAmbulanceId", ambulanceId);
        map.put("assignedHospitalId", hospitalId);
        map.put("eta", emergency.getEta());
        map.put("createdAt", emergency.getCreatedAt());
        map.putAll(extra);
        return map;
    }

    @Transactional
    public void log(Emergency emergency, String eventType, String details) {
        logRepository.save(EmergencyLog.builder()
                .emergency(emergency)
                .eventType(eventType)
                .details(details)
                .build());
    }

    private Emergency getForUpdate(UUID id) {
        return emergencyRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Emergency not found: " + id));
    }
}
