"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-lifeline-navy px-6 text-slate-100">
      <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-center shadow-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-300">System Error</p>
        <h1 className="mt-6 text-5xl font-black text-white">Something broke</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">LifeLine AI is still coordinating the city. Refresh or return to the landing page.</p>
        <button onClick={() => reset()} className="mt-8 inline-flex items-center justify-center rounded-3xl bg-blue-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-400">
          Try Again
        </button>
      </div>
    </main>
  );
}
