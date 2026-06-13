"use client";

import { SEVERITY_LEVELS } from "@/lib/constants";
import { displaySeverity } from "@/lib/utils";

interface StatusBadgeProps {
  severity: string;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ severity, size = "md" }: StatusBadgeProps) {
  const key = displaySeverity(severity) as keyof typeof SEVERITY_LEVELS;
  const data = SEVERITY_LEVELS[key] ?? SEVERITY_LEVELS.HIGH;
  const sizeClasses = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-3 text-base" };
  const colors: Record<string, string> = {
    red: "bg-red-100 text-red-800 border-red-300",
    orange: "bg-orange-100 text-orange-800 border-orange-300",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
    green: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border-2 font-bold ${sizeClasses[size]} ${colors[data.color]}`}>
      <span>{data.icon}</span>
      <span>{data.label}</span>
    </span>
  );
}
