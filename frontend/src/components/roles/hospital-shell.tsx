import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BedDouble,
  Building2,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
  Wrench,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AegisBrand } from "@/components/design-system";

export type HospitalTab = "overview" | "patients" | "beds" | "staff" | "resources" | "analytics" | "settings" | "profile";

const NAV: { id: HospitalTab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Stethoscope },
  { id: "beds", label: "Beds & ICU", icon: BedDouble },
  { id: "staff", label: "Staff", icon: Users },
  { id: "resources", label: "Resources", icon: Wrench },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
];

export function HospitalShell({
  activeTab,
  onTabChange,
  children,
  statusBadge,
}: {
  activeTab: HospitalTab;
  onTabChange: (tab: HospitalTab) => void;
  children: ReactNode;
  statusBadge?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-[#E5E7EB] bg-white lg:flex">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <AegisBrand to="/hospital" />
          <div className="mt-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-medical" />
            <div>
              <div className="text-xs font-bold text-[#111111]">City Care Hospital</div>
              <div className="text-[10px] text-[#525866]">Trauma Hub · ER-7</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "bg-medical/10 font-semibold text-medical"
                    : "text-[#525866] hover:bg-[#F8F9FB] hover:text-[#111111]",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-56">
        <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-[#111111]">
                {NAV.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-[#525866]">Hospital Operations Portal</p>
            </div>
              <div className="flex items-center gap-3">
                {statusBadge}
                <button type="button" onClick={() => onTabChange("profile")} aria-label="Open profile">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#E63946]/10 text-sm font-bold text-[#E63946]">AS</div>
                </button>
              </div>
          </div>
          <div className="mt-3 flex gap-1 overflow-x-auto lg:hidden">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                  activeTab === item.id ? "bg-medical text-white" : "bg-[#F8F9FB] text-[#525866]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
