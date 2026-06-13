package com.lifeline.grid.traffic.service;

import com.lifeline.grid.common.dto.DashboardEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrafficBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void dashboard(String type, UUID emergencyId, Object payload) {
        messagingTemplate.convertAndSend("/topic/dashboard", DashboardEvent.of(type, emergencyId, payload));
    }
}
