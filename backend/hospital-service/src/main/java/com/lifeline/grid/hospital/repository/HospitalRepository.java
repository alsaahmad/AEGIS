package com.lifeline.grid.hospital.repository;

import com.lifeline.grid.common.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {}
