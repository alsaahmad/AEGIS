package com.lifeline.grid.ambulance.service;

import com.lifeline.grid.common.dto.DashboardEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AmbulanceBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void driver(UUID ambulanceId, Object payload) {
        messagingTemplate.convertAndSend("/topic/ambulance/" + ambulanceId, payload);
    }

    public void location(UUID ambulanceId, Object payload) {
        messagingTemplate.convertAndSend("/topic/ambulance/" + ambulanceId + "/location", payload);
        messagingTemplate.convertAndSend("/topic/dashboard", DashboardEvent.of("AMBULANCE_LOCATION", null, payload));
    }

    public void dashboard(String type, UUID emergencyId, Object payload) {
        messagingTemplate.convertAndSend("/topic/dashboard", DashboardEvent.of(type, emergencyId, payload));
    }
}
