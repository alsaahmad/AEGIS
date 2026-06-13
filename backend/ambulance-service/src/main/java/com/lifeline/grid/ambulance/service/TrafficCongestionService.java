package com.lifeline.grid.ambulance.service;

import org.springframework.stereotype.Service;

@Service
public class TrafficCongestionService {
    /**
     * Mock route traffic factor for hackathon demo.
     * 0.0 = free-flow, 1.0 = extremely congested.
     */
    public double estimateCongestion(double startLat, double startLng, double endLat, double endLng) {
        double coordinateNoise = Math.abs(Math.sin((startLat + endLng) * 80.0));
        return 0.15 + coordinateNoise * 0.65;
    }
}
