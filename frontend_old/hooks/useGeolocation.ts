import { useState, useEffect } from "react";
import { CONFIG } from "@/lib/constants";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setError("Location request timed out");
      setLoading(false);
    }, CONFIG.GEOLOCATION_TIMEOUT);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        clearTimeout(timeout);
        setError(err.message);
        setLoading(false);
      },
      { timeout: CONFIG.GEOLOCATION_TIMEOUT, enableHighAccuracy: true }
    );
  }, []);

  return { location, error, loading };
}
