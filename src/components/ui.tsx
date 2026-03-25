"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode; }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/70">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] text-white">{title}</h2>
        <p className="mt-2 max-w-2xl font-body text-base text-white/65">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function GlowButton({ children, onClick, className = "", type = "button", disabled = false }: { children: React.ReactNode; onClick?: () => void; className?: string; type?: "button" | "submit"; disabled?: boolean; }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border border-cyan-400/40 bg-cyan-400/15 px-4 py-3 font-body text-sm font-semibold text-cyan-100 shadow-[0_0_30px_rgba(0,212,255,0.18)] transition hover:border-cyan-300 hover:bg-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void; }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#0f1119]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl uppercase tracking-[0.18em] text-white">{title}</h3>
              <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-white/65 transition hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
