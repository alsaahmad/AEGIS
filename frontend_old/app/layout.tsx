import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeLine AI — Emergency Operating System",
  description:
    "LifeLine AI coordinates live emergency operations with AI dispatch, ambulance routing, traffic control, hospital readiness, and volunteer activation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
