"use client";

import { motion } from "framer-motion";
import { useMissionControl } from "@/components/mission-control-provider";
import { Panel, SectionHeading } from "@/components/ui";

export function VirtualOffice() {
  const { desks } = useMissionControl();

  return (
    <>
      <SectionHeading eyebrow="Agent Floor" title="Office" description="Pixel office floor showing active desks, glowing terminals, and the current focus of each live operator." />

      <Panel className="overflow-hidden p-0">
        <div className="office-grid relative min-h-[720px] overflow-hidden rounded-[28px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.12),_transparent_28%),linear-gradient(180deg,rgba(19,23,38,0.6),rgba(5,7,12,0.8))]" />
          <div className="absolute inset-x-0 top-0 h-20 border-b border-white/10 bg-[#121522]/80" />
          <div className="absolute inset-x-0 top-20 bottom-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

          <div className="relative grid min-h-[720px] gap-8 p-8 md:grid-cols-2">
            {desks.map((desk, index) => (
              <motion.div key={desk.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="relative">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }} className="speech-bubble absolute left-1/2 top-0 z-20 w-[240px] -translate-x-1/2 rounded-[22px] border border-white/10 bg-[#161a2a]/90 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.5)]">
                  <p className="font-display text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">{desk.name}</p>
                  <p className="mt-1 font-body text-sm text-white/80">{desk.task}</p>
                </motion.div>

                <div className="pt-28">
                  <div className="relative mx-auto w-full max-w-[340px] rounded-[28px] border border-white/10 bg-[#0d1220]/90 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-x-5 top-4 h-3 rounded-full bg-white/5" />
                    <div className="mb-4 h-24 rounded-[20px] border border-white/8 p-3" style={{ backgroundColor: desk.deskTone }}>
                      <div className="flex h-full items-end justify-between">
                        <div className="h-10 w-14 rounded-[10px] bg-zinc-950/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                        <div className="relative h-16 w-24 rounded-[14px] border border-cyan-400/20 bg-[#080b14]">
                          <div className="absolute inset-2 rounded-[10px] opacity-85" style={{ background: `radial-gradient(circle at center, ${desk.glow}55, transparent 70%), linear-gradient(135deg, ${desk.glow}33, transparent)`, boxShadow: `0 0 32px ${desk.glow}55` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <PixelRaven glow={desk.glow} />
                      <div className="space-y-2 text-right">
                        <p className="font-display text-xs uppercase tracking-[0.24em] text-white/45">Desk Node</p>
                        <p className="font-body text-xl font-semibold text-white">{desk.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Panel>
    </>
  );
}

function PixelRaven({ glow }: { glow: string }) {
  return (
    <motion.div animate={{ filter: [`drop-shadow(0 0 10px ${glow}55)`, `drop-shadow(0 0 22px ${glow}99)`, `drop-shadow(0 0 10px ${glow}55)`] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }} className="relative h-24 w-24">
      <div className="absolute left-8 top-1 h-6 w-6 bg-white/85" />
      <div className="absolute left-5 top-6 h-10 w-12 bg-[#151923]" />
      <div className="absolute left-2 top-10 h-8 w-8 bg-[#0e1220]" />
      <div className="absolute left-12 top-10 h-8 w-8 bg-[#0e1220]" />
      <div className="absolute left-8 top-14 h-7 w-6 bg-[#0a0d15]" />
      <div className="absolute left-4 top-16 h-4 w-3 bg-[#0a0d15]" />
      <div className="absolute left-[70px] top-16 h-4 w-3 bg-[#0a0d15]" />
      <div className="absolute left-12 top-4 h-2 w-4" style={{ backgroundColor: glow }} />
      <div className="absolute left-[52px] top-8 h-2 w-2 bg-white" />
    </motion.div>
  );
}
