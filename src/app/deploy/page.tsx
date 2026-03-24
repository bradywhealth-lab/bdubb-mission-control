"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Activity } from "lucide-react";
import { Panel, SectionHeading } from "@/components/ui";

interface Deploy {
  project: string;
  status: string;
  url: string | null;
  lastDeploy: string | null;
  health: string | null;
}

export default function DeployPage() {
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [healthChecks, setHealthChecks] = useState<Record<string, { status: string; loading?: boolean }>>({});
  const [loading, setLoading] = useState(true);

  const fetchDeploys = async () => {
    try {
      const res = await fetch("/api/deploys");
      const data = await res.json();
      // Defensive: ensure we set an array, never an error object
      setDeploys(Array.isArray(data) ? data : []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeploys();
    const interval = setInterval(fetchDeploys, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async (project: string, url: string) => {
    setHealthChecks((prev) => ({ ...prev, [project]: { status: "checking", loading: true } }));
    try {
      await fetch(url, { method: "HEAD", mode: "no-cors" });
      setHealthChecks((prev) => ({ ...prev, [project]: { status: "ok" } }));
    } catch {
      setHealthChecks((prev) => ({ ...prev, [project]: { status: "error" } }));
    }
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    live: { color: "bg-green-400 text-green-200 border-green-400/30", label: "Live" },
    building: { color: "bg-yellow-400 text-yellow-200 border-yellow-400/30", label: "Building" },
    blocked: { color: "bg-red-400 text-red-200 border-red-400/30", label: "Blocked" },
    ready: { color: "bg-blue-400 text-blue-200 border-blue-400/30", label: "Ready" },
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading deployments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="Deployment Monitor"
        title="Deploys"
        description="Track all project deployments with live health checks and status monitoring."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {deploys.map((deploy) => {
          const config = statusConfig[deploy.status] || statusConfig.ready;
          const healthCheck = healthChecks[deploy.project];

          return (
            <Panel key={deploy.project} className="border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl uppercase tracking-[0.18em] text-white">{deploy.project}</h3>
                  <p className="mt-1 font-body text-sm text-white/60">Last deploy: {deploy.lastDeploy || "Never"}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.color}`}>
                  {config.label}
                </span>
              </div>

              {deploy.url ? (
                <div className="mb-4">
                  <a
                    href={deploy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-body text-sm">{deploy.url}</span>
                  </a>
                </div>
              ) : (
                <p className="mb-4 font-body text-sm text-white/45">No URL deployed yet</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    deploy.health === "ok" ? "bg-green-400" :
                    deploy.health === "blocked" ? "bg-red-400" :
                    "bg-gray-400"
                  }`} />
                  <span className="font-body text-xs text-white/60">Health: {deploy.health || "Unknown"}</span>
                </div>

                {deploy.url && (
                  <button
                    onClick={() => deploy.url && checkHealth(deploy.project, deploy.url)}
                    disabled={healthCheck?.loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 font-body text-xs font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/15 disabled:opacity-50"
                  >
                    <Activity className="h-3 w-3" />
                    {healthCheck?.loading ? "Checking..." : "Check Health"}
                  </button>
                )}
              </div>

              {healthCheck && !healthCheck.loading && (
                <div className="mt-3 rounded-lg border border-white/10 bg-white/4 px-3 py-2">
                  <p className={`font-body text-xs ${healthCheck.status === "ok" ? "text-green-300" : "text-red-300"}`}>
                    {healthCheck.status === "ok" ? "✓ Service is responding" : "✗ Service check failed"}
                  </p>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </>
  );
}
