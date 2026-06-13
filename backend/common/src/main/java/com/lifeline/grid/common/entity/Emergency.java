package com.lifeline.grid.common.entity;

import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import com.lifeline.grid.common.entity.enums.Severity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "emergencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emergency {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "citizen_id", nullable = false)
    private String citizenId;

    @Column(name = "location_lat", nullable = false)
    private Double locationLat;

    @Column(name = "location_lng", nullable = false)
    private Double locationLng;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyStatus status;

    @Column(name = "victim_count", nullable = false)
    private Integer victimCount;

    @Column(name = "injury_type", nullable = false)
    private String injuryType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_ambulance_id")
    private Ambulance assignedAmbulance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_hospital_id")
    private Hospital assignedHospital;

    /** ETA to hospital in minutes; updated by assignment and route orchestration. */
    @Column(name = "eta")
    private Integer eta;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
        if (severity == null) severity = Severity.UNKNOWN;
        if (status == null) status = EmergencyStatus.REPORTED;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}
