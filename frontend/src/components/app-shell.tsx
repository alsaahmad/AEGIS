import { Link } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";
import type { ReactNode } from "react";

export { StatCard, SectionCard, SeverityBadge, AegisBrand } from "@/components/design-system";

/** Public/marketing shell only — role portals use dedicated role shells. */
export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-emergency">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold tracking-tight">AEGIS</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#525866]">Protect. Respond. Save Lives.</div>
            </div>
          </Link>
          <Link to="/login" className="text-sm font-semibold text-[#525866] hover:text-[#111111]">
            Sign in
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[#525866]">{subtitle}</p>}
          {actions && <div className="mt-4">{actions}</div>}
        </div>
        <main className="fade-up">{children}</main>
      </div>
    </div>
  );
}
