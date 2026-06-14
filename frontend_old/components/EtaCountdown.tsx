"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface EtaCountdownProps {
  etaSeconds: number;
  size?: "sm" | "md" | "lg";
}

export default function EtaCountdown({ etaSeconds: initial, size = "md" }: EtaCountdownProps) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => setSeconds(initial), [initial]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const sizes = { sm: "text-lg", md: "text-3xl", lg: "text-5xl" };
  const urgent = seconds < 60;

  return (
    <div className={`flex flex-col items-center ${urgent ? "text-red-600" : "text-blue-600"}`}>
      <Clock size={size === "lg" ? 40 : size === "md" ? 32 : 20} className="mb-2" />
      <p className={`font-mono font-bold ${sizes[size]} ${urgent ? "animate-pulse" : ""}`}>{formatTime(seconds)}</p>
      <p className="text-xs text-gray-500 mt-1">ETA</p>
    </div>
  );
}
