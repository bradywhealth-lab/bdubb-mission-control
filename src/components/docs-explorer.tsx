"use client";

import { FileCode2, FileSearch, FileText, FolderKanban } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useMissionControl } from "@/components/mission-control-provider";
import { Modal, Panel, SectionHeading } from "@/components/ui";
import { DocFolder } from "@/lib/types";

const folders: DocFolder[] = ["PRDs", "Code", "Research", "Reports", "Plans", "Other"];

const folderIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PRDs: FolderKanban,
  Code: FileCode2,
  Research: FileSearch,
  Reports: FileText,
  Plans: FolderKanban,
  Other: FileText,
  SOPs: FolderKanban,
  Infra: FolderKanban,
  Trading: FileText,
  Projects: FolderKanban,
  Tools: FileCode2,
};

export function DocsExplorer() {
  const { docs } = useMissionControl();
  const [selectedFolder, setSelectedFolder] = useState<DocFolder>("PRDs");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => docs.filter((doc) => doc.folder === selectedFolder), [docs, selectedFolder]);
  const activeDoc = docs.find((doc) => doc.id === activeId) ?? null;

  return (
    <>
      <SectionHeading eyebrow="Knowledge Base" title="Docs" description="File explorer surface for plans, research, code, and reports. Open any document into a focused reading modal." />

      <div className="grid gap-4 xl:grid-cols-[0.55fr_1.45fr]">
        <Panel>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.3em] text-white/45">Folders</p>
          <div className="space-y-3">
            {folders.map((folder) => {
              const Icon = folderIcons[folder];
              const active = folder === selectedFolder;

              return (
                <button key={folder} type="button" onClick={() => setSelectedFolder(folder)} className={`flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition ${active ? "border-cyan-400/50 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/8"}`}>
                  <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : "text-white/55"}`} />
                  <span className="font-body text-base font-semibold text-white">{folder}</span>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.3em] text-cyan-300/70">{selectedFolder}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((doc) => (
              <button key={doc.id} type="button" onClick={() => setActiveId(doc.id)} className="rounded-[24px] border border-white/10 bg-[#121625] p-5 text-left transition hover:-translate-y-1 hover:border-white/20">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-cyan-200">{doc.type}</span>
                  <span className="font-body text-sm text-white/40">{doc.createdAt}</span>
                </div>
                <h3 className="font-body text-lg font-semibold text-white">{doc.title}</h3>
                <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-white/58">{doc.content}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Modal open={Boolean(activeDoc)} title={activeDoc?.title ?? "Document"} onClose={() => setActiveId(null)}>
        {activeDoc ? (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4 font-body text-sm text-white/50">
              <span>{activeDoc.folder}</span>
              <span>{activeDoc.createdAt}</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-white/80">{activeDoc.content}</pre>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
