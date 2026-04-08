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

          <div className="relative grid min-h-[720px] gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            {desks.map((desk, index) => (
              <motion.div key={desk.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }} className="speech-bubble absolute left-1/2 top-0 z-20 w-[200px] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[#161a2a]/90 px-3 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.5)]">
                  <p className="font-display text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">{desk.name}</p>
                  <p className="mt-1 font-body text-xs text-white/80 line-clamp-2">{desk.task}</p>
                </motion.div>

                <div className="pt-24">
                  <div className="relative mx-auto w-full max-w-[280px] rounded-[24px] border border-white/10 bg-[#0d1220]/90 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-x-4 top-3 h-2.5 rounded-full bg-white/5" />
                    <div className="mb-3 h-20 rounded-[16px] border border-white/8 p-2" style={{ backgroundColor: desk.deskTone }}>
                      <div className="flex h-full items-end justify-between">
                        <div className="h-8 w-12 rounded-[8px] bg-zinc-950/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                        <div className="relative h-14 w-20 rounded-[12px] border border-cyan-400/20 bg-[#080b14]">
                          <div className="absolute inset-2 rounded-[8px] opacity-85" style={{ background: `radial-gradient(circle at center, ${desk.glow}55, transparent 70%), linear-gradient(135deg, ${desk.glow}33, transparent)`, boxShadow: `0 0 32px ${desk.glow}55` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <PixelRaven glow={desk.glow} />
                      <div className="space-y-1 text-right">
                        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-white/45">Desk Node</p>
                        <p className="font-body text-lg font-semibold text-white">{desk.name}</p>
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
    <motion.div animate={{ filter: [`drop-shadow(0 0 10px ${glow}55)`, `drop-shadow(0 0 22px ${glow}99)`, `drop-shadow(0 0 10px ${glow}55)`] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }} className="relative h-20 w-20">
      <div className="absolute left-7 top-1 h-5 w-5 bg-white/85" />
      <div className="absolute left-4 top-5 h-9 w-10 bg-[#151923]" />
      <div className="absolute left-1 top-9 h-7 w-7 bg-[#0e1220]" />
      <div className="absolute left-11 top-9 h-7 w-7 bg-[#0e1220]" />
      <div className="absolute left-7 top-13 h-6 w-5 bg-[#0a0d15]" />
      <div className="absolute left-3 top-14 h-3 w-2.5 bg-[#0a0d15]" />
      <div className="absolute left-[60px] top-14 h-3 w-2.5 bg-[#0a0d15]" />
      <div className="absolute left-10 top-3 h-2 w-3.5" style={{ backgroundColor: glow }} />
      <div className="absolute left-[45px] top-7 h-2 w-2 bg-white" />
    </motion.div>
  );
}
