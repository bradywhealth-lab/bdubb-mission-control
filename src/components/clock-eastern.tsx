"use client";

import { useEffect, useState } from "react";

export function ClockEastern() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });

    const update = () => setNow(`${formatter.format(new Date())} ET`);

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:self-auto">
      <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(0,212,255,0.95)]" />
      <div>
        <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/50">Eastern Time</p>
        <p className="font-body text-sm font-semibold text-white">{now}</p>
      </div>
    </div>
  );
}
