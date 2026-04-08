"use client";

import { FileCode2, FileSearch, FileText, FolderKanban, Loader2, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Panel, SectionHeading } from "@/components/ui";

type DocFolder = "SOPs" | "Memory" | "Infra" | "Trading" | "Projects" | "Tools" | "PRDs" | "Code" | "Research" | "Reports" | "Plans" | "Other";

interface DocEntry {
  id: string;
  folder: DocFolder;
  title: string;
  type: string;
  createdAt: string;
  content: string;
  path?: string;
}

const folders: DocFolder[] = ["SOPs", "Memory", "Infra", "Trading", "Projects", "Tools", "PRDs", "Code", "Research", "Reports", "Plans", "Other"];

const folderIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PRDs: FolderKanban,
  Code: FileCode2,
  Research: FileSearch,
  Reports: FileText,
  Plans: FolderKanban,
  Other: FileText,
  SOPs: FolderKanban,
  Memory: FileText,
  Infra: FolderKanban,
  Trading: FileText,
  Projects: FolderKanban,
  Tools: FileCode2,
};

export function DocsExplorer() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<DocFolder>("SOPs");
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/docs");
      const data = await res.json();
      setDocs(data);
      // Auto-select first folder that has docs
      if (data.length > 0) {
        const firstFolder = data[0].folder;
        setSelectedFolder(firstFolder);
      }
    } catch (e) {
      console.error("Failed to fetch docs", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const folderCounts = useMemo(() => {
    return docs.reduce((acc, doc) => {
      acc[doc.folder] = (acc[doc.folder] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [docs]);

  const availableFolders = folders.filter((f) => folderCounts[f] > 0);

  const filtered = useMemo(() => docs.filter((doc) => doc.folder === selectedFolder), [docs, selectedFolder]);
  const activeDoc = docs.find((doc) => doc.id === activeId) ?? null;

  return (
    <>
      <SectionHeading eyebrow="Knowledge Base" title="Docs" description="Live file explorer — MASTER-CONTEXT, memory, workflows, tools, and all project docs. Always up to date." />

      <div className="grid gap-4 xl:grid-cols-[0.55fr_1.45fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-white/45">Folders</p>
            <button
              type="button"
              onClick={fetchDocs}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-white/30">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {(availableFolders.length > 0 ? availableFolders : folders).map((folder) => {
                const Icon = folderIcons[folder] ?? FileText;
                const active = folder === selectedFolder;
                const count = folderCounts[folder] ?? 0;

                return (
                  <button key={folder} type="button" onClick={() => setSelectedFolder(folder)} className={`flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition ${active ? "border-cyan-400/50 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/8"}`}>
                    <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : "text-white/55"}`} />
                    <span className="flex-1 font-body text-base font-semibold text-white">{folder}</span>
                    {count > 0 && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/40">{count}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.3em] text-cyan-300/70">{selectedFolder}</p>
          {filtered.length === 0 ? (
            <p className="py-8 text-center font-body text-sm text-white/30">No documents in this folder.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((doc) => (
                <button key={doc.id} type="button" onClick={() => setActiveId(doc.id)} className="rounded-[24px] border border-white/10 bg-[#121625] p-5 text-left transition hover:-translate-y-1 hover:border-white/20">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-cyan-200">{doc.type}</span>
                    <span className="font-body text-sm text-white/40">{doc.createdAt}</span>
                  </div>
                  <h3 className="font-body text-lg font-semibold text-white">{doc.title}</h3>
                  <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-white/58">{doc.content.slice(0, 200)}</p>
                </button>
              ))}
            </div>
          )}
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
