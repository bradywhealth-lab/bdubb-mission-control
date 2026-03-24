"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { deskAgents, docs, initialTasks, memoryEntries, team } from "@/lib/mock-data";
import { DocEntry, MemoryEntry, Task, TaskPriority, TaskStatus, TeamMember } from "@/lib/types";

type CreateTaskInput = {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  status?: TaskStatus;
  scheduledFor?: string;
};

type MissionControlContextValue = {
  tasks: Task[];
  memory: MemoryEntry[];
  docs: DocEntry[];
  team: TeamMember[];
  desks: typeof deskAgents;
  moveTask: (taskId: string, status: TaskStatus) => void;
  createTask: (input: CreateTaskInput) => void;
};

const MissionControlContext = createContext<MissionControlContextValue | null>(null);

export function MissionControlProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const value = useMemo<MissionControlContextValue>(
    () => ({
      tasks,
      memory: memoryEntries,
      docs,
      team,
      desks: deskAgents,
      moveTask: (taskId, status) => {
        setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
      },
      createTask: ({ title, description, priority, assignee, status = "Backlog", scheduledFor }) => {
        setTasks((current) => [
          {
            id: `task-${crypto.randomUUID()}`,
            title,
            description,
            priority,
            assignee,
            createdAt: new Date().toISOString().slice(0, 10),
            status,
            scheduledFor,
          },
          ...current,
        ]);
      },
    }),
    [tasks],
  );

  return <MissionControlContext.Provider value={value}>{children}</MissionControlContext.Provider>;
}

export function useMissionControl() {
  const context = useContext(MissionControlContext);

  if (!context) {
    throw new Error("useMissionControl must be used within MissionControlProvider");
  }

  return context;
}
