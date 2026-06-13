package com.lifeline.grid.traffic.repository;

import com.lifeline.grid.common.entity.TrafficSignal;
import com.lifeline.grid.common.entity.enums.TrafficSignalState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TrafficSignalRepository extends JpaRepository<TrafficSignal, UUID> {
    List<TrafficSignal> findByCurrentStateAndPriorityExpiresAtBefore(TrafficSignalState state, Instant instant);
}
