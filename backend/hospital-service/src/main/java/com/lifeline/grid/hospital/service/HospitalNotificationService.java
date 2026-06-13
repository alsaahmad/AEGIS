package com.lifeline.grid.hospital.service;

import com.lifeline.grid.common.dto.HospitalNotifyRequest;
import com.lifeline.grid.common.dto.HospitalUpdateRequest;
import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.EmergencyLog;
import com.lifeline.grid.common.entity.Hospital;
import com.lifeline.grid.hospital.repository.EmergencyLogRepository;
import com.lifeline.grid.hospital.repository.EmergencyRepository;
import com.lifeline.grid.hospital.repository.HospitalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class HospitalNotificationService {
    private final HospitalRepository hospitalRepository;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyLogRepository logRepository;
    private final HospitalBroadcastService broadcaster;

    @Transactional
    public Map<String, Object> notify(UUID hospitalId, HospitalNotifyRequest request) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new EntityNotFoundException("Hospital not found: " + hospitalId));
        Emergency emergency = emergencyRepository.findById(request.emergencyId())
                .orElseThrow(() -> new EntityNotFoundException("Emergency not found: " + request.emergencyId()));

        if (hospital.getAvailableIcuBeds() <= 0) {
            throw new IllegalStateException("No ICU beds available at " + hospital.getName());
        }
        hospital.setAvailableIcuBeds(hospital.getAvailableIcuBeds() - 1);
        hospital.setCurrentLoadPct(1.0 - (hospital.getAvailableIcuBeds() / (double) Math.max(hospital.getTotalIcuBeds(), 1)));
        hospitalRepository.save(hospital);

        java.util.HashMap<String, Object> alert = new java.util.HashMap<>();
        alert.put("hospitalId", hospitalId);
        alert.put("hospitalName", hospital.getName());
        alert.put("emergencyId", request.emergencyId());
        alert.put("incomingPatientSeverity", request.severity() == null ? "UNKNOWN" : request.severity());
        alert.put("injuryType", request.injuryType() == null ? "unknown" : request.injuryType());
        alert.put("etaMinutes", request.etaMinutes() == null ? 0 : request.etaMinutes());
        alert.put("ambulanceId", request.ambulanceId() == null ? "" : request.ambulanceId());
        alert.put("availableIcuBeds", hospital.getAvailableIcuBeds());
        log.info("Mock push to hospital dashboard: {}", alert);
        broadcaster.hospital(hospitalId, alert);
        broadcaster.dashboard("HOSPITAL_NOTIFIED", request.emergencyId(), alert);
        broadcaster.dashboard("HOSPITAL_ASSIGNED", request.emergencyId(), alert);

        logRepository.save(EmergencyLog.builder()
                .emergency(emergency)
                .eventType("HOSPITAL_NOTIFIED")
                .details("Hospital " + hospital.getName() + " notified; ICU bed reserved; ETA=" + request.etaMinutes())
                .build());
        return alert;
    }

    @Transactional
    public Map<String, Object> updateBeds(UUID hospitalId, HospitalUpdateRequest request) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new EntityNotFoundException("Hospital not found: " + hospitalId));
        if (request.availableIcuBeds() > hospital.getTotalIcuBeds()) {
            throw new IllegalArgumentException("availableIcuBeds cannot exceed totalIcuBeds");
        }
        hospital.setAvailableIcuBeds(request.availableIcuBeds());
        hospital.setCurrentLoadPct(1.0 - (hospital.getAvailableIcuBeds() / (double) Math.max(hospital.getTotalIcuBeds(), 1)));
        hospitalRepository.save(hospital);
        Map<String, Object> payload = snapshot(hospital);
        broadcaster.dashboard("ICU_BEDS_UPDATED", null, payload);
        return payload;
    }

    public Map<String, Object> snapshot(Hospital hospital) {
        java.util.HashMap<String, Object> map = new java.util.HashMap<>();
        map.put("id", hospital.getId());
        map.put("name", hospital.getName());
        map.put("lat", hospital.getLat());
        map.put("lng", hospital.getLng());
        map.put("totalIcuBeds", hospital.getTotalIcuBeds());
        map.put("availableIcuBeds", hospital.getAvailableIcuBeds());
        map.put("specializations", hospital.getSpecializations() == null ? "" : hospital.getSpecializations());
        map.put("phone", hospital.getPhone() == null ? "" : hospital.getPhone());
        map.put("currentLoadPct", hospital.getCurrentLoadPct() == null ? 0.0 : hospital.getCurrentLoadPct());
        return map;
    }
}
