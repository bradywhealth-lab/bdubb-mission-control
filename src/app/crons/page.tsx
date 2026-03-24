"use client";

import { useEffect, useState } from "react";
import { Panel, SectionHeading } from "@/components/ui";

interface CronJob {
  name: string;
  schedule: string;
  lastRun: string | null;
  lastStatus: string;
  channel: string;
}

export default function CronsPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/crons");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch cron jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig: Record<string, { color: string; pulse: boolean }> = {
    ok: { color: "bg-green-400", pulse: true },
    error: { color: "bg-red-400", pulse: false },
    pending: { color: "bg-yellow-400", pulse: false },
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading cron jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="Scheduled Jobs"
        title="Crons"
        description="Monitor all scheduled cron jobs with execution status and channel destinations."
      />

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 text-left font-display text-xs uppercase tracking-[0.28em] text-white/60">Name</th>
                <th className="px-5 py-4 text-left font-display text-xs uppercase tracking-[0.28em] text-white/60">Schedule</th>
                <th className="px-5 py-4 text-left font-display text-xs uppercase tracking-[0.28em] text-white/60">Last Run</th>
                <th className="px-5 py-4 text-left font-display text-xs uppercase tracking-[0.28em] text-white/60">Status</th>
                <th className="px-5 py-4 text-left font-display text-xs uppercase tracking-[0.28em] text-white/60">Channel</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const config = statusConfig[job.lastStatus] || statusConfig.pending;

                return (
                  <tr key={job.name} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-semibold text-white">{job.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-white/80">{job.schedule}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-white/60">{job.lastRun || "Never"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${config.color} ${config.pulse ? "animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.3)]" : ""}`} />
                        <span className="font-body text-sm capitalize text-white/80">{job.lastStatus}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-body text-xs text-cyan-300">
                        {job.channel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
