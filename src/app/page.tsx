"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Rocket, Zap } from "lucide-react";
import { Panel } from "@/components/ui";

interface Task { id: string; title: string; description: string; assignee: string; status: string; }
interface Agent { status: string; currentTask: string | null; lastActive: string; }
interface Deploy { status: string; project: string; url: string | null; }
interface Event { agent: string; message: string; timestamp: string; type: string; }

const agentColors: Record<string, string> = {
  FORGE: "text-orange-400",
  ORACLE: "text-blue-400",
  SENTINEL: "text-red-400",
  AP: "text-cyan-400",
  PHANTOM: "text-purple-400",
  CIPHER: "text-green-400",
  SCRIBE: "text-yellow-400",
  ATLAS: "text-white",
  VERIFY: "text-pink-400",
};

const statusColors: Record<string, string> = {
  online: "bg-green-400",
  building: "bg-yellow-400",
  monitoring: "bg-blue-400",
  idle: "bg-gray-400",
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Record<string, Agent>>({});
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, agentsRes, deploysRes, eventsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/agents"),
        fetch("/api/deploys"),
        fetch("/api/events"),
      ]);

      const [tasksData, agentsData, deploysData, eventsData] = await Promise.all([
        tasksRes.json(),
        agentsRes.json(),
        deploysRes.json(),
        eventsRes.json(),
      ]);

      // Defensive: ensure we set valid types, never error objects
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setAgents(agentsData && typeof agentsData === "object" && !Array.isArray(agentsData) ? agentsData : {});
      setDeploys(Array.isArray(deploysData) ? deploysData : []);
      setEvents(Array.isArray(eventsData) ? eventsData.slice(0, 10) : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const openTasks = tasks.filter((t: Task) => t.status !== "done").length;
  const activeAgents = Object.values(agents).filter((a) => a.status !== "idle").length;
  const projectsLive = deploys.filter((d) => d.status === "live").length;
  const eventsToday = events.filter((e) => new Date(e.timestamp).toDateString() === new Date().toDateString()).length;
  const blockedTasks = tasks.filter((t: Task) => t.status === "blocked");

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

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Initializing Mission Control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Tasks" value={openTasks} icon={Zap} color="text-cyan-400" />
        <StatCard label="Active Agents" value={activeAgents} icon={Activity} color="text-green-400" />
        <StatCard label="Projects Live" value={projectsLive} icon={Rocket} color="text-purple-400" />
        <StatCard label="Events Today" value={eventsToday} icon={Activity} color="text-orange-400" />
      </div>

      {/* Event Feed */}
      <Panel className="p-5">
        <h2 className="mb-4 font-display text-lg uppercase tracking-[0.2em] text-white">Live Event Feed</h2>
        <div className="space-y-3">
          {events.map((event) => (
            <motion.div
              key={event.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3"
            >
              <div className={`mt-1 h-2 w-2 rounded-full ${agentColors[event.agent] || "text-white"}`} />
              <div className="flex-1">
                <p className={`font-display text-xs uppercase tracking-[0.2em] ${agentColors[event.agent] || "text-white/70"}`}>
                  {event.agent}
                </p>
                <p className="mt-1 font-body text-sm text-white/90">{event.message}</p>
              </div>
              <p className="font-body text-xs text-white/45">{formatTime(event.timestamp)}</p>
            </motion.div>
          ))}
        </div>
      </Panel>

      {/* Agent Status Grid */}
      <Panel className="p-5">
        <h2 className="mb-4 font-display text-lg uppercase tracking-[0.2em] text-white">Agent Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(agents).map(([name, agent]) => (
            <div key={name} className="rounded-xl border border-white/10 bg-white/4 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-white">{name}</p>
                <div className={`h-2.5 w-2.5 rounded-full ${statusColors[agent.status] || "bg-gray-400"} shadow-[0_0_12px_rgba(255,255,255,0.3)]`} />
              </div>
              <p className="mt-2 font-body text-sm text-white/70">{agent.currentTask || "Idle"}</p>
              <p className="mt-1 font-body text-xs text-white/45">{formatLastActive(agent.lastActive)}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Deploy Health */}
      <Panel className="p-5">
        <h2 className="mb-4 font-display text-lg uppercase tracking-[0.2em] text-white">Deploy Health</h2>
        <div className="flex flex-wrap gap-3">
          {deploys.map((deploy) => (
            <div key={deploy.project} className="rounded-xl border border-white/10 bg-white/4 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  deploy.status === "live" ? "bg-green-400" :
                  deploy.status === "building" ? "bg-yellow-400" :
                  deploy.status === "blocked" ? "bg-red-400" : "bg-blue-400"
                }`} />
                <p className="font-display text-sm font-semibold text-white">{deploy.project}</p>
              </div>
              <p className="mt-1 font-body text-xs text-white/45 capitalize">{deploy.status}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Blocked Items */}
      {blockedTasks.length > 0 && (
        <Panel className="border-red-400/30 bg-red-400/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="font-display text-lg uppercase tracking-[0.2em] text-red-400">Blocked Items</h2>
          </div>
          <div className="space-y-3">
            {blockedTasks.map((task: Task) => (
              <div key={task.id} className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
                <p className="font-display text-sm font-semibold text-white">{task.title}</p>
                <p className="mt-1 font-body text-sm text-white/70">{task.description}</p>
                <p className="mt-2 font-body text-xs text-red-300">Assigned: {task.assignee}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <Panel className="border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <Icon className={`h-6 w-6 ${color}`} />
        <p className="font-display text-3xl font-bold text-white">{value}</p>
      </div>
      <p className="mt-3 font-display text-xs uppercase tracking-[0.28em] text-white/60">{label}</p>
    </Panel>
  );
}
