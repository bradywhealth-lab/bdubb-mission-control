"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckSquare, Rocket, Zap } from "lucide-react";
import { Panel } from "@/components/ui";

interface Task { id: string; title: string; description: string; assignee: string; status: string; priority: string; createdAt: string; updatedAt: string; }
interface Agent { status: string; currentTask: string | null; lastActive: string; }
interface Deploy { status: string; project: string; url: string | null; health: string | null; }
interface Event { agent: string; message: string; timestamp: string; type: string; }

const AGENTS = ["AP", "FORGE", "ORACLE", "SENTINEL", "PHANTOM", "CIPHER", "SCRIBE", "ATLAS", "VERIFY"] as const;

const agentColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  AP: { bg: "bg-cyan-400/10", text: "text-cyan-300", dot: "bg-cyan-400", border: "border-cyan-400/30" },
  FORGE: { bg: "bg-orange-400/10", text: "text-orange-300", dot: "bg-orange-400", border: "border-orange-400/30" },
  ORACLE: { bg: "bg-blue-400/10", text: "text-blue-300", dot: "bg-blue-400", border: "border-blue-400/30" },
  SENTINEL: { bg: "bg-red-400/10", text: "text-red-300", dot: "bg-red-400", border: "border-red-400/30" },
  PHANTOM: { bg: "bg-purple-400/10", text: "text-purple-300", dot: "bg-purple-400", border: "border-purple-400/30" },
  CIPHER: { bg: "bg-green-400/10", text: "text-green-300", dot: "bg-green-400", border: "border-green-400/30" },
  SCRIBE: { bg: "bg-yellow-400/10", text: "text-yellow-300", dot: "bg-yellow-400", border: "border-yellow-400/30" },
  ATLAS: { bg: "bg-white/10", text: "text-white", dot: "bg-white", border: "border-white/30" },
  VERIFY: { bg: "bg-teal-400/10", text: "text-teal-300", dot: "bg-teal-400", border: "border-teal-400/30" },
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

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setAgents(agentsData && typeof agentsData === "object" && !Array.isArray(agentsData) ? agentsData : {});
      setDeploys(Array.isArray(deploysData) ? deploysData : []);
      setEvents(Array.isArray(eventsData) ? eventsData.slice(0, 15) : []);
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

  const activeAgents = Object.values(agents).filter((a) => a.status && a.status !== "idle").length;
  const openTasks = tasks.filter((t: Task) => t.status !== "done").length;
  const projectsLive = deploys.filter((d) => d.status === "live").length;
  const eventsToday = events.filter((e) => {
    const eventDate = new Date(e.timestamp).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  }).length;
  const blockedTasks = tasks.filter((t: Task) => t.status === "blocked");

  function formatLastActive(timestamp: string | null): { text: string; color: string } {
    if (!timestamp) return { text: "Never", color: "text-gray-500" };
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return { text: "<1 min ago", color: "text-green-400" };
    if (mins < 60) return { text: `${mins} min ago`, color: "text-green-400" };
    const hours = Math.floor(mins / 60);
    if (hours < 24) return { text: `${hours}h ago`, color: "text-green-400" };
    return { text: `${Math.floor(hours / 24)}d ago`, color: "text-yellow-400" };
  }

  function formatEventTime(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
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
      {/* Top Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Agents" value={activeAgents} total={9} icon={Activity} color="cyan" />
        <StatCard label="Open Tasks" value={openTasks} total={tasks.length} icon={CheckSquare} color="purple" />
        <StatCard label="Projects Live" value={projectsLive} total={deploys.length} icon={Rocket} color="green" />
        <StatCard label="Events Today" value={eventsToday} icon={Zap} color="orange" />
      </div>

      {/* Agent Status Grid - All 9 Agents */}
      <Panel className="p-6">
        <h2 className="mb-5 font-display text-lg uppercase tracking-[0.2em] text-white">Agent Status Grid</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((name) => {
            const agent = agents[name];
            const colors = agentColors[name] || agentColors.AP;
            const status = agent?.status || "idle";
            const lastActive = formatLastActive(agent?.lastActive || null);
            const isPulse = status !== "idle";

            return (
              <motion.div
                key={name}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border ${colors.border} ${colors.bg} px-5 py-4 transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${statusColors[status] || "bg-gray-400"} ${isPulse ? "animate-pulse shadow-[0_0_12px_currentColor]" : ""}`} />
                    <div>
                      <p className={`font-display text-base font-bold ${colors.text}`}>{name}</p>
                      <p className={`font-display text-[10px] uppercase tracking-[0.2em] ${colors.text}/70`}>
                        {status === "idle" ? "Idle" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 font-body text-sm text-white/80 line-clamp-2">
                  {agent?.currentTask || "Idle"}
                </p>
                <p className={`mt-2 font-body text-xs ${lastActive.color}`}>
                  Last active {lastActive.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Panel>

      {/* Live Event Feed */}
      <Panel className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg uppercase tracking-[0.2em] text-white">Live Event Feed</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-body text-xs text-green-400">Live</span>
          </div>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {events.map((event, idx) => {
              const colors = agentColors[event.agent] || agentColors.AP;
              return (
                <motion.div
                  key={event.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-start gap-3 rounded-xl border ${colors.border} ${colors.bg} px-4 py-3`}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${colors.dot} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-display text-[10px] uppercase tracking-[0.15em] ${colors.text}`}>
                      {event.agent}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-white/90 truncate">{event.message}</p>
                  </div>
                  <p className="shrink-0 font-body text-xs text-white/45">{formatEventTime(event.timestamp)}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Panel>

      {/* Deploy Health Row */}
      <Panel className="p-6">
        <h2 className="mb-5 font-display text-lg uppercase tracking-[0.2em] text-white">Deploy Health</h2>
        <div className="flex flex-wrap gap-3">
          {deploys.map((deploy) => (
            <motion.div
              key={deploy.project}
              whileHover={{ y: -2 }}
              className={`rounded-xl border px-4 py-3 transition ${
                deploy.status === "live"
                  ? "border-green-400/30 bg-green-400/10"
                  : deploy.status === "ready"
                  ? "border-blue-400/30 bg-blue-400/10"
                  : "border-gray-400/30 bg-gray-400/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  deploy.status === "live" ? "bg-green-400" :
                  deploy.status === "ready" ? "bg-blue-400" :
                  deploy.status === "building" ? "bg-yellow-400" :
                  "bg-gray-400"
                }`} />
                <p className="font-display text-sm font-semibold text-white">{deploy.project}</p>
              </div>
              <p className={`mt-1 font-body text-xs capitalize ${
                deploy.status === "live" ? "text-green-300" :
                deploy.status === "ready" ? "text-blue-300" :
                "text-gray-400"
              }`}>
                {deploy.status}
              </p>
            </motion.div>
          ))}
        </div>
      </Panel>

      {/* Blocked Tasks Alert */}
      {blockedTasks.length > 0 && (
        <Panel className="border-red-400/30 bg-red-400/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="font-display text-lg uppercase tracking-[0.2em] text-red-400">Blocked Tasks</h2>
            <span className="ml-auto rounded-full bg-red-400/20 px-3 py-1 font-body text-xs font-semibold text-red-300">
              {blockedTasks.length} blocked
            </span>
          </div>
          <div className="space-y-3">
            {blockedTasks.map((task: Task) => (
              <motion.div
                key={task.id}
                whileHover={{ x: 4 }}
                className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3"
              >
                <p className="font-display text-sm font-semibold text-white">{task.title}</p>
                <p className="mt-1 font-body text-sm text-white/70 line-clamp-2">{task.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 font-body text-[10px] uppercase font-semibold ${
                    task.priority === "high" ? "bg-red-400/20 text-red-300" :
                    task.priority === "medium" ? "bg-yellow-400/20 text-yellow-300" :
                    "bg-gray-400/20 text-gray-300"
                  }`}>
                    {task.priority}
                  </span>
                  <p className="font-body text-xs text-red-300">Assigned: {task.assignee}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function StatCard({ label, value, total, icon: Icon, color }: { label: string; value: number; total?: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  const colorClasses: Record<string, { text: string; bg: string; border: string }> = {
    cyan: { text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
    purple: { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
    green: { text: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" },
    orange: { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  };
  const c = colorClasses[color] || colorClasses.cyan;

  return (
    <Panel className={`${c.border} ${c.bg} p-5`}>
      <div className="flex items-center justify-between">
        <Icon className={`h-6 w-6 ${c.text}`} />
        <p className={`font-display text-3xl font-bold ${c.text}`}>{value}{total !== undefined && <span className={`text-lg ${c.text}/60`}>/{total}</span>}</p>
      </div>
      <p className="mt-3 font-display text-xs uppercase tracking-[0.28em] text-white/60">{label}</p>
    </Panel>
  );
}
