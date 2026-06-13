package com.lifeline.grid.emergency.controller;

import com.lifeline.grid.common.dto.VolunteerAlertRequest;
import com.lifeline.grid.common.dto.VolunteerAlertResponse;
import com.lifeline.grid.emergency.service.VolunteerAlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/volunteers")
@RequiredArgsConstructor
public class VolunteerController {
    private final VolunteerAlertService volunteerAlertService;

    @PostMapping("/alert")
    public VolunteerAlertResponse alert(@Valid @RequestBody VolunteerAlertRequest request) {
        return volunteerAlertService.alertNearby(request.emergencyId());
    }
}
