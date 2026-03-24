"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { GlowButton, Modal, Panel, SectionHeading } from "@/components/ui";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";

const columns: TaskStatus[] = ["Backlog", "In Progress", "In Review", "Done"];

const priorityStyles: Record<TaskPriority, string> = {
  High: "bg-pink-500/20 text-pink-200 border-pink-400/30",
  Med: "bg-amber-500/20 text-amber-100 border-amber-400/30",
  Low: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
};

const statusMap: Record<string, TaskStatus> = {
  "backlog": "Backlog",
  "in-progress": "In Progress",
  "in-review": "In Review",
  "done": "Done",
};

const reverseStatusMap: Record<TaskStatus, string> = {
  "Backlog": "backlog",
  "In Progress": "in-progress",
  "In Review": "in-review",
  "Done": "done",
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "High" as TaskPriority,
    assignee: "AP",
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.map((t: { status: string; priority: string; createdAt?: string }) => ({
        ...t,
        status: statusMap[t.status] || "Backlog",
        priority: (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) as TaskPriority,
        createdAt: t.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      })));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    const apiStatus = reverseStatusMap[newStatus];
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const createTask = async () => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "backlog",
        }),
      });
      await fetchTasks();
      setOpen(false);
      setForm({ title: "", description: "", priority: "High", assignee: "AP" });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const grouped = useMemo(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column] = tasks.filter((task) => task.status === column);
          return acc;
        },
        {} as Record<TaskStatus, Task[]>,
      ),
    [tasks],
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="Execution Grid"
        title="Kanban"
        description="Operational task lanes for AP and supporting agents. Drag cards to change state or inject new work from the command queue."
        action={
          <GlowButton onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Task
          </GlowButton>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <Panel key={column} className="min-h-[520px] border-white/8 bg-white/[0.04] p-4">
            <div className="flex h-full flex-col" onDragOver={(event) => event.preventDefault()} onDrop={() => draggingId && moveTask(draggingId, column)}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-[0.2em] text-white">{column}</h3>
                  <p className="font-body text-sm text-white/45">{grouped[column].length} tasks</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(0,212,255,0.85)]" />
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {grouped[column].map((task) => (
                  <motion.article
                    layout
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => setDraggingId(null)}
                    whileHover={{ y: -4 }}
                    className="cursor-grab rounded-[24px] border border-white/10 bg-[#111420] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] active:cursor-grabbing"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h4 className="font-body text-base font-semibold text-white">{task.title}</h4>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="mb-4 font-body text-sm leading-6 text-white/65">{task.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/55">
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/35">Assignee</p>
                        <p className="mt-1 font-body font-semibold text-white/85">{task.assignee}</p>
                      </div>
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/35">Created</p>
                        <p className="mt-1 font-body font-semibold text-white/85">{task.createdAt}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Modal open={open} title="Inject New Task" onClose={() => setOpen(false)}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createTask();
          }}
        >
          <FormField label="Title">
            <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="input" />
          </FormField>
          <FormField label="Description">
            <textarea required value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="input min-h-28 resize-none" />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Priority">
              <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TaskPriority }))} className="input">
                <option>High</option>
                <option>Med</option>
                <option>Low</option>
              </select>
            </FormField>
            <FormField label="Assignee">
              <input value={form.assignee} onChange={(event) => setForm((current) => ({ ...current, assignee: event.target.value }))} className="input" />
            </FormField>
          </div>
          <GlowButton type="submit" className="w-full">Create Task</GlowButton>
        </form>
      </Modal>
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">{label}</span>
      {children}
    </label>
  );
}
