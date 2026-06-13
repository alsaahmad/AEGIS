package com.lifeline.grid.hospital.service;

import com.lifeline.grid.common.dto.DashboardEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HospitalBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void dashboard(String type, UUID emergencyId, Object payload) {
        messagingTemplate.convertAndSend("/topic/dashboard", DashboardEvent.of(type, emergencyId, payload));
    }

    public void hospital(UUID hospitalId, Object payload) {
        messagingTemplate.convertAndSend("/topic/hospital/" + hospitalId, payload);
    }
}
