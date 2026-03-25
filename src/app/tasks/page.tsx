"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Filter, X } from "lucide-react";
import { Panel, GlowButton, Modal, SectionHeading } from "@/components/ui";

interface Task { id: string; title: string; description: string; assignee: string; status: string; priority: string; createdAt: string; updatedAt: string; }

const statusOptions = ["all", "backlog", "in-progress", "blocked", "done"] as const;
const priorityOptions = ["all", "high", "medium", "info", "low"] as const;
const assignees = ["all", "AP", "FORGE", "ORACLE", "SENTINEL", "PHANTOM", "CIPHER", "SCRIBE", "ATLAS", "VERIFY"] as const;

const priorityColors: Record<string, string> = {
  high: "bg-red-400/20 text-red-300",
  medium: "bg-yellow-400/20 text-yellow-300",
  info: "bg-blue-400/20 text-blue-300",
  low: "bg-gray-400/20 text-gray-300",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "all", assignee: "all", priority: "all" });
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "AP", priority: "high", status: "backlog" });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (filters.status !== "all") {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.assignee !== "all") {
      filtered = filtered.filter(t => t.assignee === filters.assignee);
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleCreateTask = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        await fetchTasks();
        setModalOpen(false);
        setNewTask({ title: "", description: "", assignee: "AP", priority: "high", status: "backlog" });
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
    setEditingTask(null);
    setEditStatus("");
  };

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-body text-white/70">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        eyebrow="Task Management"
        title="Tasks"
        description="View, filter, and manage all agent tasks."
        action={
          <GlowButton onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </GlowButton>
        }
      />

      {/* Filters */}
      <Panel className="mb-6 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-4 w-4 text-white/60" />
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white/80">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setFilters(f => ({ ...f, status }))}
                className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition ${
                  filters.status === status
                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                }`}
              >
                {status === "all" ? "All Status" : status.replace("-", " ")}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {assignees.map(assignee => (
              <button
                key={assignee}
                onClick={() => setFilters(f => ({ ...f, assignee }))}
                className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition ${
                  filters.assignee === assignee
                    ? "bg-purple-400/20 text-purple-300 border border-purple-400/40"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                }`}
              >
                {assignee === "all" ? "All Agents" : assignee}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Task List */}
      <Panel className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg uppercase tracking-[0.2em] text-white">
            {filteredTasks.length} {filteredTasks.length === 1 ? "Task" : "Tasks"}
          </h2>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -2 }}
                onClick={() => { setEditingTask(task.id); setEditStatus(task.status); }}
                className={`group relative rounded-xl border ${
                  task.status === "done"
                    ? "border-green-400/20 bg-green-400/5 opacity-60"
                    : task.status === "blocked"
                    ? "border-red-400/30 bg-red-400/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                } px-5 py-4 transition cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    task.status === "done"
                      ? "border-green-400/30 bg-green-400/10"
                      : "border-cyan-400/30 bg-cyan-400/10"
                  }`}>
                    <span className="font-display text-sm font-bold text-white">
                      {task.assignee.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-display text-base font-semibold ${
                          task.status === "done" ? "text-white/50 line-through" : "text-white"
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`mt-1 font-body text-sm ${
                            task.status === "done" ? "text-white/40" : "text-white/70"
                          } line-clamp-2`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 font-body text-[10px] uppercase font-semibold ${
                          task.status === "done"
                            ? "bg-green-400/20 text-green-300"
                            : task.status === "blocked"
                            ? "bg-red-400/20 text-red-300"
                            : task.status === "in-progress"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-gray-400/20 text-gray-300"
                        }`}>
                          {task.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-body text-[10px] uppercase font-semibold ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className="font-body text-xs text-white/50">
                        {task.assignee}
                      </span>
                      <span className="font-body text-xs text-white/40">
                        {formatDate(task.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline Edit */}
                {editingTask === task.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="absolute inset-x-0 bottom-0 z-10 rounded-b-xl border-t border-white/10 bg-black/90 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs text-white/60">Change Status:</span>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.filter(s => s !== "all").map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(task.id, status)}
                            className={`rounded-full px-3 py-1 font-body text-xs font-semibold transition ${
                              editStatus === status
                                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
                                : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {status.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => { setEditingTask(null); setEditStatus(""); }}
                        className="ml-auto rounded-full p-1.5 text-white/50 hover:text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-white/40">No tasks found</p>
            <p className="mt-2 font-body text-sm text-white/30">Try adjusting your filters</p>
          </div>
        )}
      </Panel>

      {/* New Task Modal */}
      <Modal open={modalOpen} title="Create New Task" onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-white/70">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
              placeholder="Task title..."
            />
          </div>

          <div>
            <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-white/70">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none resize-none"
              rows={3}
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-white/70">Assignee</label>
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-body text-sm text-white focus:border-cyan-400/50 focus:outline-none"
              >
                {assignees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-white/70">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-body text-sm text-white focus:border-cyan-400/50 focus:outline-none"
              >
                {priorityOptions.filter(p => p !== "all").map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-white/70">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-body text-sm text-white focus:border-cyan-400/50 focus:outline-none"
              >
                {statusOptions.filter(s => s !== "all").map(s => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-body text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <GlowButton onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              Create Task
            </GlowButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
