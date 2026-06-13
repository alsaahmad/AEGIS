package com.lifeline.grid.common.entity;

import com.lifeline.grid.common.entity.enums.TrafficSignalState;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "traffic_signals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficSignal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "road_segment", nullable = false)
    private String roadSegment;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_state", nullable = false)
    private TrafficSignalState currentState;

    @Column(name = "controlled_by_corridor_id")
    private UUID controlledByCorridorId;

    @Column(name = "priority_expires_at")
    private Instant priorityExpiresAt;

    @PrePersist
    void onCreate() {
        if (currentState == null) currentState = TrafficSignalState.RED;
    }
}
