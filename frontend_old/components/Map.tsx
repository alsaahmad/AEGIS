"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { MAPBOX_TOKEN } from "@/lib/config";

interface MapProps {
  emergencyLocation: { lat: number; lng: number };
  ambulanceLocation?: { lat: number; lng: number } | null;
  hospitalName?: string | null;
  height?: string;
}

export default function Map({
  emergencyLocation,
  ambulanceLocation,
  height = "300px",
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [emergencyLocation.lng, emergencyLocation.lat],
      zoom: 13,
    });
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [emergencyLocation.lat, emergencyLocation.lng]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    markersRef.current.push(
      new mapboxgl.Marker({ color: "#dc2626" })
        .setLngLat([emergencyLocation.lng, emergencyLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Emergency</strong>"))
        .addTo(mapRef.current)
    );
    if (ambulanceLocation) {
      markersRef.current.push(
        new mapboxgl.Marker({ color: "#059669" })
          .setLngLat([ambulanceLocation.lng, ambulanceLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>Ambulance</strong>"))
          .addTo(mapRef.current!)
      );
    }
  }, [emergencyLocation, ambulanceLocation]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        style={{ height }}
        className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex flex-col items-center justify-center gap-4 border border-slate-400"
      >
        <MapPin size={48} className="text-slate-600" />
        <div className="text-center">
          <p className="font-bold text-gray-800">Map Display</p>
          <p className="text-sm text-gray-700">
            {emergencyLocation.lat.toFixed(4)}, {emergencyLocation.lng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ height }} className="rounded-lg w-full" />;
}
