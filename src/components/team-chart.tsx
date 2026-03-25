"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Panel, SectionHeading } from "@/components/ui";

interface Agent {
  status: string;
  currentTask: string | null;
  lastActive: string;
}

const agents = ["AP", "FORGE", "SENTINEL", "ORACLE", "PHANTOM", "CIPHER", "SCRIBE", "ATLAS", "VERIFY"];
const specialties: Record<string, string> = {
  AP: "Lead Agent - Coordination",
  FORGE: "Build & Engineering",
  SENTINEL: "Security & Monitoring",
  ORACLE: "Research & Intelligence",
  PHANTOM: "Stealth Operations",
  CIPHER: "Encryption & Security",
  SCRIBE: "Documentation & Logs",
  ATLAS: "Mapping & Navigation",
  VERIFY: "Testing & QA",
};

const aiSystems: Record<string, string> = {
  AP: "Claude Opus 4.6",
  FORGE: "Claude Opus 4.6",
  SENTINEL: "Claude Sonnet 4.6",
  ORACLE: "Claude Opus 4.6",
  PHANTOM: "Claude Sonnet 4.6",
  CIPHER: "Claude Opus 4.6",
  SCRIBE: "Claude Sonnet 4.6",
  ATLAS: "Claude Sonnet 4.6",
  VERIFY: "Claude Haiku 4.5",
};

const statusColors: Record<string, string> = {
  online: "bg-green-400",
  building: "bg-yellow-400",
  monitoring: "bg-blue-400",
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

  const lead = "AP";
  const reports = agents.filter((a) => a !== lead);

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
      <SectionHeading eyebrow="Chain of Command" title="Team" description="Org chart for AP and supporting sub-agents with system, status, and operating specialty." />

      <Panel className="overflow-hidden">
        <div className="relative min-h-[620px] overflow-x-auto rounded-[28px] p-4 md:p-8">
          <div className="absolute left-1/2 top-[210px] hidden h-16 w-px -translate-x-1/2 bg-white/15 md:block" />
          <div className="absolute left-1/2 top-[274px] hidden h-px w-[70%] -translate-x-1/2 bg-white/15 md:block" />

          <div className="mb-16 flex justify-center">
            <AgentCard name={lead} agent={agentData[lead]} lead />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {reports.map((name) => (
              <div key={name} className="relative">
                <div className="absolute left-1/2 top-[-28px] hidden h-8 w-px -translate-x-1/2 bg-white/15 md:block" />
                <AgentCard name={name} agent={agentData[name]} />
              </div>
            ))}
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
          <p className="font-display text-xs uppercase tracking-[0.24em] text-cyan-300/70">{lead ? "Lead Agent" : "Sub-Agent"}</p>
        </div>
      </div>

      <div className="space-y-3 font-body text-sm">
        <InfoRow label="AI System" value={aiSystems[name] || "Claude"} />
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40">Status</p>
          <div className="mt-1 flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColor} ${isPulse ? "animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.3)]" : ""}`} />
            <p className="text-white/82 capitalize">{agent?.status || "Unknown"}</p>
          </div>
        </div>
        <InfoRow label="Current Task" value={agent?.currentTask || "Idle"} />
        <InfoRow label="Specialty" value={specialties[name] || "Operations"} />
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40">Last Active</p>
          <p className={`mt-1 ${formatLastActiveColor(agent?.lastActive || null)}`}>
            {agent?.lastActive ? formatLastActive(agent.lastActive) : "Never"}
          </p>
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

function formatLastActive(timestamp: string): string {
  if (!timestamp) return "Never";
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatLastActiveColor(timestamp: string | null): string {
  if (!timestamp) return "text-gray-500";
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = diff / 3600000;
  if (hours < 24) return "text-green-400";
  return "text-yellow-400";
}
