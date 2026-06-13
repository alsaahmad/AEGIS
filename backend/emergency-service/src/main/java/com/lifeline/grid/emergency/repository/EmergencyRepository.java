package com.lifeline.grid.emergency.repository;

import com.lifeline.grid.common.entity.Emergency;
import com.lifeline.grid.common.entity.enums.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EmergencyRepository extends JpaRepository<Emergency, UUID> {
    List<Emergency> findByStatusNot(EmergencyStatus status);
}
