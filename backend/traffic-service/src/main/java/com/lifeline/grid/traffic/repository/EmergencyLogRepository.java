package com.lifeline.grid.traffic.repository;

import com.lifeline.grid.common.entity.EmergencyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmergencyLogRepository extends JpaRepository<EmergencyLog, UUID> {}
