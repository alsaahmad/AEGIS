"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { MAPBOX_TOKEN } from "@/lib/config";

interface Emergency {
  id: string;
  severity: string;
  location: { lat: number; lng: number };
  injuryType: string;
}

interface Ambulance {
  id: string;
  location: { lat: number; lng: number };
  status: string;
}

interface CommandMapProps {
  emergencies: Emergency[];
  ambulances: Ambulance[];
  selectedEmergencyId: string | null;
  layersVisible: Record<string, boolean>;
}

export default function CommandMap({
  emergencies,
  ambulances,
  layersVisible,
}: CommandMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [77.5946, 12.9716],
      zoom: 12,
    });
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (layersVisible.emergencies) {
      emergencies.forEach((e) => {
        const color =
          e.severity === "CRITICAL" ? "#dc2626" :
          e.severity === "HIGH" ? "#ea580c" :
          e.severity === "MEDIUM" || e.severity === "MODERATE" ? "#eab308" : "#16a34a";
        markersRef.current.push(
          new mapboxgl.Marker({ color })
            .setLngLat([e.location.lng, e.location.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${e.injuryType}</strong><br/>${e.severity}`))
            .addTo(mapRef.current!)
        );
      });
    }

    if (layersVisible.ambulances) {
      ambulances.forEach((a) => {
        const el = document.createElement("div");
        el.className = "text-lg";
        el.textContent = "🚑";
        markersRef.current.push(
          new mapboxgl.Marker({ element: el })
            .setLngLat([a.location.lng, a.location.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${a.id.substring(0, 8)}</strong><br/>${a.status}`))
            .addTo(mapRef.current!)
        );
      });
    }
  }, [emergencies, ambulances, layersVisible]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 relative">
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10">
          <MapPin size={48} className="text-slate-500 mb-4" />
          <p className="text-slate-400 font-medium">Command Map</p>
          <div className="mt-6 grid grid-cols-2 gap-3 px-6">
            {emergencies.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-red-600/80 text-white text-xs font-semibold text-center">
                🚨 {e.injuryType}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
