"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMissionControl } from "@/components/mission-control-provider";
import { GlowButton, Modal, Panel, SectionHeading } from "@/components/ui";
import { TaskPriority } from "@/lib/types";

const priorityDot: Record<TaskPriority, string> = {
  High: "bg-pink-400",
  Med: "bg-amber-300",
  Low: "bg-emerald-300",
};

export function CalendarView() {
  const { tasks, createTask } = useMissionControl();
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "AP",
    priority: "Med" as TaskPriority,
    scheduledFor: today.toISOString().slice(0, 10),
  });

  const calendarDays = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startOffset = (start.getDay() + 6) % 7;
    const days: Array<string | null> = [];

    for (let i = 0; i < startOffset; i += 1) days.push(null);
    for (let day = 1; day <= end.getDate(); day += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      days.push(date.toISOString().slice(0, 10));
    }

    return days;
  }, [month]);

  const selectedTasks = tasks.filter((task) => task.scheduledFor === selected);

  return (
    <>
      <SectionHeading
        eyebrow="Schedule Matrix"
        title="Calendar"
        description="Monthly visibility across cron jobs and agent task runs. Click a day to inspect queued execution."
        action={
          <GlowButton onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Task
          </GlowButton>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <Panel>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-white/45">Active Month</p>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.18em] text-white">
                {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </h3>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-display text-[10px] uppercase tracking-[0.24em] text-white/35">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const dayTasks = tasks.filter((task) => task.scheduledFor === date);
              const active = date === selected;

              return (
                <button
                  key={date ?? `empty-${index}`}
                  type="button"
                  disabled={!date}
                  onClick={() => date && setSelected(date)}
                  className={`min-h-28 rounded-[22px] border p-3 text-left transition ${
                    date
                      ? active
                        ? "border-cyan-400/60 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  {date ? (
                    <>
                      <div className="font-body text-sm font-semibold text-white">{Number(date.slice(-2))}</div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dayTasks.slice(0, 4).map((task) => (
                          <span key={task.id} className={`h-2.5 w-2.5 rounded-full ${priorityDot[task.priority]}`} title={task.title} />
                        ))}
                      </div>
                      <div className="mt-3 space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div key={task.id} className="truncate rounded-lg bg-white/6 px-2 py-1 font-body text-xs text-white/70">{task.title}</div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300/70">Day Console</p>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.16em] text-white">{selected}</h3>
          <p className="mt-2 font-body text-sm text-white/55">Scheduled execution windows and assigned agents.</p>

          <div className="mt-6 space-y-3">
            {selectedTasks.length ? selectedTasks.map((task) => (
              <div key={task.id} className="rounded-[22px] border border-white/10 bg-[#121625] p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="font-body text-base font-semibold text-white">{task.title}</h4>
                  <span className={`h-2.5 w-2.5 rounded-full ${priorityDot[task.priority]}`} />
                </div>
                <p className="font-body text-sm text-white/60">{task.description}</p>
                <div className="mt-4 flex items-center justify-between font-body text-sm text-white/45">
                  <span>{task.assignee}</span>
                  <span>{task.status}</span>
                </div>
              </div>
            )) : (
              <div className="rounded-[22px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-center font-body text-white/45">
                No scheduled jobs on this date.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Modal open={open} title="Schedule Agent Task" onClose={() => setOpen(false)}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createTask(form);
            setSelected(form.scheduledFor);
            setOpen(false);
          }}
        >
          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">Task Name</span>
            <input required className="input" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">Description</span>
            <textarea required className="input min-h-28 resize-none" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">Date</span>
              <input type="date" required className="input" value={form.scheduledFor} onChange={(event) => setForm((current) => ({ ...current, scheduledFor: event.target.value }))} />
            </label>
            <label className="block">
              <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">Agent</span>
              <input className="input" value={form.assignee} onChange={(event) => setForm((current) => ({ ...current, assignee: event.target.value }))} />
            </label>
            <label className="block">
              <span className="mb-2 block font-display text-xs uppercase tracking-[0.28em] text-white/45">Priority</span>
              <select className="input" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TaskPriority }))}>
                <option>High</option>
                <option>Med</option>
                <option>Low</option>
              </select>
            </label>
          </div>
          <GlowButton type="submit" className="w-full">Schedule</GlowButton>
        </form>
      </Modal>
    </>
  );
}
