"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookMarked, BrainCircuit, CalendarDays, KanbanSquare, LayoutGrid, Network, Sparkles, Zap } from "lucide-react";
import { ClockEastern } from "@/components/clock-eastern";

const navItems = [
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/office", label: "Office", icon: LayoutGrid },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/memory", label: "Memory", icon: BrainCircuit },
  { href: "/docs", label: "Docs", icon: BookMarked },
  { href: "/team", label: "Team", icon: Network },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.18),_transparent_30%),#0a0a0f] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col md:flex-row">
        <aside className="border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl md:w-72 md:border-b-0 md:border-r md:px-5 md:py-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_40px_rgba(0,212,255,0.35)]">
              <Zap className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-[0.35em] text-cyan-300/80">Mission Control</p>
              <p className="font-body text-lg font-semibold text-white">AP for BDUBB</p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link key={href} href={href} className="min-w-max md:min-w-0">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                      active
                        ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,212,255,0.18)]"
                        : "border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/8"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-cyan-300" : "text-white/70 group-hover:text-white"}`} />
                    <span className="font-body text-base font-semibold">{label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded-3xl border border-white/10 bg-white/5 p-4 md:block">
            <div className="mb-3 flex items-center gap-2 text-cyan-300">
              <Sparkles className="h-4 w-4" />
              <span className="font-display text-xs uppercase tracking-[0.28em]">System Status</span>
            </div>
            <p className="font-body text-sm text-white/75">
              AP is actively coordinating execution, reviews, memory, and scheduled synth runs.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-display text-xl uppercase tracking-[0.32em] text-white">Mission Control ⚡</h1>
                <p className="font-body text-sm text-white/60">Personal command center for AxonPoe.</p>
              </div>
              <ClockEastern />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
