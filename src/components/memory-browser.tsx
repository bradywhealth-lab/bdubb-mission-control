"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useMissionControl } from "@/components/mission-control-provider";
import { Panel, SectionHeading } from "@/components/ui";

export function MemoryBrowser() {
  const { memory } = useMissionControl();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(memory[0]?.id ?? "");

  const filtered = useMemo(
    () =>
      memory.filter((entry) => {
        const q = query.toLowerCase();
        return entry.title.toLowerCase().includes(q) || entry.category.toLowerCase().includes(q) || entry.content.toLowerCase().includes(q);
      }),
    [memory, query],
  );

  const selected = filtered.find((entry) => entry.id === selectedId) ?? filtered[0];

  return (
    <>
      <SectionHeading eyebrow="Context Vault" title="Memory" description="Browse structured MEMORY.md snapshots, search by category or content, and inspect the retained agent state." />

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input placeholder="Search memory..." value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-11" />
          </div>

          <div className="mt-5 space-y-3">
            {filtered.map((entry) => {
              const active = entry.id === selected?.id;
              return (
                <button key={entry.id} type="button" onClick={() => setSelectedId(entry.id)} className={`w-full rounded-[22px] border p-4 text-left transition ${active ? "border-cyan-400/50 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/8"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-body text-base font-semibold text-white">{entry.title}</p>
                      <p className="mt-2 font-body text-sm text-white/45">{entry.date}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-cyan-200">{entry.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel className="min-h-[560px]">
          {selected ? (
            <>
              <div className="mb-5 border-b border-white/10 pb-5">
                <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300/70">{selected.category}</p>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.16em] text-white">{selected.title}</h3>
                <p className="mt-2 font-body text-sm text-white/45">{selected.date}</p>
              </div>
              <pre className="overflow-auto whitespace-pre-wrap font-mono text-sm leading-7 text-white/78">{selected.content}</pre>
            </>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center font-body text-white/45">No memory entries match the search.</div>
          )}
        </Panel>
      </div>
    </>
  );
}
