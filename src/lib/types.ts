export type TaskStatus = "Backlog" | "In Progress" | "In Review" | "Done";
export type TaskPriority = "High" | "Med" | "Low";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  createdAt: string;
  status: TaskStatus;
  scheduledFor?: string;
};

export type DeskAgent = {
  id: string;
  name: string;
  task: string;
  glow: string;
  deskTone: string;
};

export type MemoryEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
};

export type DocFolder = "PRDs" | "Code" | "Research" | "Reports" | "Plans" | "Other" | "SOPs" | "Infra" | "Trading" | "Projects" | "Tools";

export type DocEntry = {
  id: string;
  folder: DocFolder;
  title: string;
  type: string;
  createdAt: string;
  content: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  aiSystem: string;
  status: string;
  specialty: string;
  leadId?: string;
};

export type HandoffStatus = "COMPLETE" | "INCOMPLETE" | "BLOCKED" | "WIP" | "UNKNOWN";

export type HandoffEntry = {
  id: string;
  project: string;
  filename: string;
  path: string;
  status: HandoffStatus;
  date: string;
  slug: string;
  content: string;
  modifiedAt: string;
};
