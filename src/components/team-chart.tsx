"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Panel, SectionHeading } from "@/components/ui";

interface Agent {
  status: string;
  currentTask: string | null;
  lastActive: string;
}

const specialties: Record<string, string> = {
  BA: "Front-door Operator — Routing and Command Center",
  Scout: "Creative Engine — Ideas, Enhancements, Revenue Discovery",
  Sentinel: "Anti-Drift Watchdog — Health and Governance",
  Blacksmith: "Complex Lead Builder — Architecture and Deep Implementation",
  Borealis: "Medium Builder — Features and Integrations",
  Blitz: "Quick Builder — Fast Fixes and Scripts",
  Inspector: "QA and Release Gate — Universal Verification",
  Curator: "Knowledge Manager — Docs, Memory, Research Synthesis",
  Upgrader: "Optimization — Benchmarking and Cost Tuning",
};

const aiSystems: Record<string, string> = {
  BA: "Claude Sonnet 4.6",
  Scout: "Kimi K2.5",
  Sentinel: "Kimi K2.5",
  Blacksmith: "Claude Sonnet 4.6",
  Borealis: "GPT-5.1 Codex Mini",
  Blitz: "GPT-5 Mini",
  Inspector: "GPT-5.1",
  Curator: "Kimi K2.5",
  Upgrader: "Kimi K2.5",
};

const statusColors: Record<string, string> = {
  online: "bg-green-400",
  building: "bg-yellow-400",
  monitoring: "bg-blue-400",
  "on-call": "bg-purple-400",
  idle: "bg-gray-400",
};

export function TeamChart() {
  const [agentData, setAgentData] = useState<Record<string, Agent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents");
        const data = await res.json();
        setAgentData(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const lead = "BA";
  const builders = ["Blacksmith", "Borealis", "Blitz"];
  const support = ["Scout", "Sentinel", "Inspector", "Curator", "Upgrader"];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading eyebrow="Agency2 Roster" title="Agents" description="9-agent team: BA at the front door, specialists in lanes, every outcome owned." />

      <Panel className="overflow-hidden">
        <div className="relative min-h-[620px] overflow-x-auto rounded-[28px] p-4 md:p-8">
          {/* BA at top */}
          <div className="mb-12 flex justify-center">
            <AgentCard name={lead} agent={agentData[lead]} lead />
          </div>

          {/* Builder lane */}
          <div className="mb-8">
            <p className="mb-4 font-display text-xs uppercase tracking-[0.28em] text-cyan-300/60 text-center">Builder Lane</p>
            <div className="grid gap-6 md:grid-cols-3 justify-items-center">
              {builders.map((name) => (
                <AgentCard key={name} name={name} agent={agentData[name]} />
              ))}
            </div>
          </div>

          {/* Support agents */}
          <div>
            <p className="mb-4 font-display text-xs uppercase tracking-[0.28em] text-cyan-300/60 text-center">Specialists</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 justify-items-center">
              {support.map((name) => (
                <AgentCard key={name} name={name} agent={agentData[name]} />
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}

function AgentCard({ name, agent, lead = false }: { name: string; agent: Agent | undefined; lead?: boolean }) {
  const statusColor = agent?.status ? statusColors[agent.status] : "bg-gray-400";
  const isPulse = agent?.status && agent.status !== "idle";

  return (
    <motion.div whileHover={{ y: -6 }} className={`rounded-[28px] border p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)] ${lead ? "w-full max-w-sm border-cyan-400/45 bg-cyan-400/10" : "border-white/10 bg-[#111522]/90"}`}>
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1120]">
          <div className="absolute inset-3 rounded-xl bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.65),_transparent_65%),#131824]" />
          <div className="relative h-8 w-8 bg-[#0c1017] before:absolute before:left-2 before:top-0 before:h-2 before:w-4 before:bg-cyan-300 after:absolute after:left-4 after:top-3 after:h-1.5 after:w-1.5 after:bg-white" />
        </div>
        <div>
          <p className="font-body text-xl font-semibold text-white">{name}</p>
          <p className="font-display text-xs uppercase tracking-[0.24em] text-cyan-300/70">{lead ? "Front-door Operator" : "Specialist"}</p>
        </div>
      </div>

      <div className="space-y-3 font-body text-sm">
        <InfoRow label="Model" value={aiSystems[name] || "Claude"} />
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40">Status</p>
          <div className="mt-1 flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColor} ${isPulse ? "animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.3)]" : ""}`} />
            <p className="text-white/82 capitalize">{agent?.status || "Unknown"}</p>
          </div>
        </div>
        <InfoRow label="Current Task" value={agent?.currentTask || "Idle"} />
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40">Specialty</p>
          <p className="mt-1 text-white/82 text-xs leading-relaxed">{specialties[name] || "Operations"}</p>
        </div>
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
