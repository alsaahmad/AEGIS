import type { LucideIcon } from "lucide-react";
import { Clock, HeartPulse, Home, MapPin, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AegisBrand } from "@/components/design-system";
import { Avatar } from "@/components/ui/avatar";

export type CitizenTab = "home" | "emergency" | "tracking" | "history" | "profile";

const TABS: { id: CitizenTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "emergency", label: "Emergency", icon: HeartPulse },
  { id: "tracking", label: "Tracking", icon: MapPin },
  { id: "history", label: "History", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
];

export function CitizenShell({
  activeTab,
  onTabChange,
  children,
  header,
}: {
  activeTab: CitizenTab;
  onTabChange: (tab: CitizenTab) => void;
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden lg:flex flex-col border-r border-[#E5E7EB] bg-white p-4 w-[300px]">
        <div className="mb-6">
          <AegisBrand to="/citizen" />
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeTab === t.id ? "bg-[#E63946] text-white" : "text-[#525866] hover:bg-[#F8F9FB]",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-4">
          <button type="button" onClick={() => onTabChange("profile")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ring-1 ring-[#E5E7EB]">
            <Avatar className="h-8 w-8" />
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-[#111111]">Aarav Sharma</div>
              <div className="text-[10px] text-[#525866]">Citizen</div>
            </div>
            <div className="text-[10px] text-[#525866]">Profile</div>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AegisBrand compact to="/citizen" />
              {header}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onTabChange("profile")} aria-label="Open profile">
                <Avatar className="h-9 w-9" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] p-6">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex w-full items-stretch justify-around px-2 py-1.5">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              const isEmergency = tab.id === "emergency";
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors",
                    active && !isEmergency && "text-[#E63946]",
                    active && isEmergency && "text-[#E63946]",
                    !active && "text-[#525866]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full transition-all",
                      isEmergency && "bg-[#E63946] text-white shadow-md",
                      !isEmergency && active && "bg-[#E63946]/10",
                      !isEmergency && !active && "bg-transparent",
                    )}
                  >
                    <tab.icon className={cn("h-5 w-5", isEmergency && "text-white")} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
