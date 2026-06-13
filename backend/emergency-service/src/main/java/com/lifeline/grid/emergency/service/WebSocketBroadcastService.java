package com.lifeline.grid.emergency.service;

import com.lifeline.grid.common.dto.DashboardEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WebSocketBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void dashboard(String type, UUID emergencyId, Object payload) {
        messagingTemplate.convertAndSend("/topic/dashboard", DashboardEvent.of(type, emergencyId, payload));
    }

    public void emergency(UUID emergencyId, String type, Object payload) {
        messagingTemplate.convertAndSend("/topic/emergency/" + emergencyId, DashboardEvent.of(type, emergencyId, payload));
        dashboard(type, emergencyId, payload);
    }

    public void ambulanceLocation(UUID ambulanceId, Object payload) {
        messagingTemplate.convertAndSend("/topic/ambulance/" + ambulanceId + "/location", payload);
        dashboard("AMBULANCE_LOCATION", null, payload);
    }
}
