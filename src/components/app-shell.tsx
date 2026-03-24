"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Building2, Clock, DollarSign, LayoutDashboard, Kanban, Menu, ScrollText, Rocket, Users, X } from "lucide-react";
import { ClockEastern } from "@/components/clock-eastern";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/kanban", label: "Kanban", icon: Kanban },
  { href: "/team", label: "Agents", icon: Users },
  { href: "/logs", label: "Logs", icon: ScrollText },
  { href: "/deploy", label: "Deploy", icon: Rocket },
  { href: "/crons", label: "Crons", icon: Clock },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/office", label: "Office", icon: Building2 },
  { href: "/docs", label: "Docs", icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.18),_transparent_30%),#0a0a0f] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col md:flex-row">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-3"
        >
          <Menu className="h-5 w-5 text-cyan-300" />
        </button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 z-50 h-full w-72 border-r border-white/10 bg-black/95 p-5"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-4 top-4 rounded-xl border border-white/10 p-2"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
                <SidebarContent pathname={pathname} onItemClick={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside className="hidden border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl md:block md:w-72 md:border-b-0 md:border-r md:px-5 md:py-6">
          <SidebarContent pathname={pathname} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-display text-xl uppercase tracking-[0.32em] text-white">Mission Control ⚡</h1>
                <p className="font-body text-sm text-white/60">BDUBB HQ Command Center</p>
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

function SidebarContent({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_40px_rgba(0,212,255,0.35)]">
          <span className="text-xl">🦅</span>
        </div>
        <div>
          <p className="font-display text-sm uppercase tracking-[0.35em] text-cyan-300/80">BDUBB HQ</p>
          <p className="font-body text-lg font-semibold text-white">⚡ Mission Control</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link key={href} href={href} onClick={onItemClick}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  active
                    ? "border-l-4 border-l-cyan-400 border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,212,255,0.18)]"
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

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
          <span className="font-display text-xs uppercase tracking-[0.28em] text-green-300">System Online</span>
        </div>
        <ClockEastern />
      </div>
    </>
  );
}
