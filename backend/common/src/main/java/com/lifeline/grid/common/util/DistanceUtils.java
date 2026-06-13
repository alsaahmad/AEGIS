package com.lifeline.grid.common.util;

public final class DistanceUtils {
    private static final double EARTH_RADIUS_KM = 6371.0088;

    private DistanceUtils() {}

    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double rLat1 = Math.toRadians(lat1);
        double rLat2 = Math.toRadians(lat2);

        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(rLat1) * Math.cos(rLat2) * Math.pow(Math.sin(dLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /** Returns 1.0 when value is 0, approaching 0 as value grows. */
    public static double inverseScore(double value, double softness) {
        return 1.0 / (1.0 + Math.max(value, 0.0) / softness);
    }
}
