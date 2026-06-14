import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: "default" | "emergency" | "medical" | "success" | "warning";
}) {
  const accentMap = {
    default: "from-secondary to-secondary/50 border-border",
    emergency: "from-primary/10 to-primary/2 border-primary/10",
    medical: "from-medical/10 to-medical/2 border-medical/10",
    success: "from-success/10 to-success/2 border-success/10",
    warning: "from-warning/10 to-warning/2 border-warning/10",
  } as const;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        accentMap[accent],
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#525866]">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-[#111111]">{value}</p>
          {hint && <p className="mt-1 text-xs text-[#525866]">{hint}</p>}
        </div>
        {Icon && (
          <Icon
            className={cn(
              "h-5 w-5",
              accent === "emergency"
                ? "text-primary"
                : accent === "medical"
                  ? "text-medical"
                  : accent === "success"
                    ? "text-success"
                    : accent === "warning"
                      ? "text-warning"
                      : "text-[#525866]",
            )}
          />
        )}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
  actions,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm", className)}>
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-[#111111]">{title}</h2>
          {description && <p className="truncate text-xs font-medium text-[#525866]">{description}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function SeverityBadge({ severity }: { severity: "critical" | "high" | "medium" | "low" }) {
  const map = {
    critical: "bg-primary/10 text-primary border-primary/20",
    high: "bg-warning/10 text-warning border-warning/20",
    medium: "bg-medical/10 text-medical border-medical/20",
    low: "bg-success/10 text-success border-success/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map[severity],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity}
    </span>
  );
}

import { Link } from "@tanstack/react-router";

export function AegisBrand({ compact, to }: { compact?: boolean; to?: string }) {
  const inner = (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-emergency">
        <span className="text-sm font-black text-white">A</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-[#111111]">AEGIS</div>
          <div className="text-[9px] font-semibold uppercase tracking-widest text-[#525866]">Protect. Respond. Save Lives.</div>
        </div>
      )}
    </div>
  );

  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
}
