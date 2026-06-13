package com.lifeline.grid.ambulance.repository;

import com.lifeline.grid.common.entity.Ambulance;
import com.lifeline.grid.common.entity.enums.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AmbulanceRepository extends JpaRepository<Ambulance, UUID> {
    List<Ambulance> findByStatus(AmbulanceStatus status);
}
