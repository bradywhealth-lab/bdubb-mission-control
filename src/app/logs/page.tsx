"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Panel, SectionHeading } from "@/components/ui";

interface Event {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: string;
}

const agentColors: Record<string, string> = {
  FORGE: "bg-orange-400",
  ORACLE: "bg-blue-400",
  SENTINEL: "bg-red-400",
  AP: "bg-cyan-400",
  PHANTOM: "bg-purple-400",
  CIPHER: "bg-green-400",
  SCRIBE: "bg-yellow-400",
  ATLAS: "bg-white",
  VERIFY: "bg-pink-400",
};

const typeColors: Record<string, string> = {
  info: "bg-blue-400/20 text-blue-300",
  warn: "bg-yellow-400/20 text-yellow-300",
  error: "bg-red-400/20 text-red-300",
  deploy: "bg-green-400/20 text-green-300",
  status: "bg-purple-400/20 text-purple-300",
};

export default function LogsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [agentFilter, setAgentFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter !== "all" && event.type !== filter) return false;
    if (agentFilter !== "all" && event.agent !== agentFilter) return false;
    return true;
  });

  const agents = Array.from(new Set(events.map((e) => e.agent)));
  const types = Array.from(new Set(events.map((e) => e.type)));

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading event log...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="System Logs"
        title="Events"
        description="Full event log with filtering by agent and event type. Auto-refreshes every 15 seconds."
      />

      <Panel className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-cyan-300">
            <Filter className="h-4 w-4" />
            <span className="font-display text-xs uppercase tracking-[0.28em]">Filters</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white focus:border-cyan-400/50 focus:outline-none"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white focus:border-cyan-400/50 focus:outline-none"
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
          <p className="ml-auto font-body text-sm text-white/60">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>
      </Panel>

      <Panel className="p-5">
        <div className="space-y-2">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/4 px-4 py-3 hover:border-white/15"
            >
              <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${agentColors[event.agent] || "bg-white"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-white/90">{event.agent}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${typeColors[event.type] || "bg-gray-400/20 text-gray-300"}`}>
                    {event.type}
                  </span>
                </div>
                <p className="mt-2 font-body text-sm text-white/90">{event.message}</p>
              </div>
              <p className="flex-shrink-0 font-body text-xs text-white/45">{formatTime(event.timestamp)}</p>
            </motion.div>
          ))}
        </div>
      </Panel>
    </>
  );
}
