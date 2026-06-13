package com.lifeline.grid.hospital.repository;

import com.lifeline.grid.common.entity.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmergencyRepository extends JpaRepository<Emergency, UUID> {}
