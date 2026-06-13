package com.lifeline.grid.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "total_icu_beds", nullable = false)
    private Integer totalIcuBeds;

    @Column(name = "available_icu_beds", nullable = false)
    private Integer availableIcuBeds;

    /** Comma-separated values: cardiac,trauma,burns,general */
    @Column(columnDefinition = "TEXT")
    private String specializations;

    private String phone;

    @Column(name = "current_load_pct", nullable = false)
    private Double currentLoadPct;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
        if (currentLoadPct == null) currentLoadPct = 0.35;
    }
}
