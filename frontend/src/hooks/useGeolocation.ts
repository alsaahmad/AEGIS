import { useEffect, useState } from "react";
import { CONFIG, DEFAULT_LOCATION } from "@/config/constants";

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
      { timeout: CONFIG.GEOLOCATION_TIMEOUT, enableHighAccuracy: true },
    );
  }, []);

  const fallback = {
    lat: location?.latitude ?? DEFAULT_LOCATION.lat,
    lng: location?.longitude ?? DEFAULT_LOCATION.lng,
  };

  return { location, error, loading, fallback };
}
