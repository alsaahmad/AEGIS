package com.lifeline.grid.emergency.repository;

import com.lifeline.grid.common.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VolunteerRepository extends JpaRepository<Volunteer, UUID> {
    List<Volunteer> findByIsAvailableTrue();
}
