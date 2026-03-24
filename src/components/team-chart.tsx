"use client";

import { motion } from "framer-motion";
import { useMissionControl } from "@/components/mission-control-provider";
import { Panel, SectionHeading } from "@/components/ui";

export function TeamChart() {
  const { team } = useMissionControl();
  const lead = team.find((member) => member.role === "Lead Agent");
  const reports = team.filter((member) => member.leadId === lead?.id);

  return (
    <>
      <SectionHeading eyebrow="Chain of Command" title="Team" description="Org chart for AP and supporting sub-agents with system, status, and operating specialty." />

      <Panel className="overflow-hidden">
        <div className="relative min-h-[620px] overflow-x-auto rounded-[28px] p-4 md:p-8">
          <div className="absolute left-1/2 top-[210px] hidden h-16 w-px -translate-x-1/2 bg-white/15 md:block" />
          <div className="absolute left-1/2 top-[274px] hidden h-px w-[70%] -translate-x-1/2 bg-white/15 md:block" />

          {lead ? <div className="mb-16 flex justify-center"><AgentCard member={lead} lead /></div> : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {reports.map((member) => (
              <div key={member.id} className="relative">
                <div className="absolute left-1/2 top-[-28px] hidden h-8 w-px -translate-x-1/2 bg-white/15 md:block" />
                <AgentCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </>
  );
}

type Member = ReturnType<typeof useMissionControl>["team"][number];

function AgentCard({ member, lead = false }: { member: Member; lead?: boolean }) {
  return (
    <motion.div whileHover={{ y: -6 }} className={`rounded-[28px] border p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)] ${lead ? "w-full max-w-sm border-cyan-400/45 bg-cyan-400/10" : "border-white/10 bg-[#111522]/90"}`}>
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1120]">
          <div className="absolute inset-3 rounded-xl bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.65),_transparent_65%),#131824]" />
          <div className="relative h-8 w-8 bg-[#0c1017] before:absolute before:left-2 before:top-0 before:h-2 before:w-4 before:bg-cyan-300 after:absolute after:left-4 after:top-3 after:h-1.5 after:w-1.5 after:bg-white" />
        </div>
        <div>
          <p className="font-body text-xl font-semibold text-white">{member.name}</p>
          <p className="font-display text-xs uppercase tracking-[0.24em] text-cyan-300/70">{member.role}</p>
        </div>
      </div>

      <div className="space-y-3 font-body text-sm">
        <InfoRow label="AI System" value={member.aiSystem} />
        <InfoRow label="Status" value={member.status} />
        <InfoRow label="Specialty" value={member.specialty} />
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40">{label}</p>
      <p className="mt-1 text-white/82">{value}</p>
    </div>
  );
}
