import { appBarProjects } from "./appbar";
import { freelancerProjects } from "./freelancer";
import { personalProjects } from "./personal";

export type { Project } from "./types";

export type ProjectFolderId = "personal" | "freelancer" | "appbar";

export interface ProjectFolder {
  id: ProjectFolderId;
  title: string;
  eyebrow: string;
  description: string;
  role: string;
  projects: import("./types").Project[];
}

export const projectFolders: ProjectFolder[] = [
  {
    id: "appbar",
    title: "App Bar",
    eyebrow: "2026 · Project Manager",
    description: "Mobile and web products delivered with cross-functional teams.",
    role: "Project Manager supporting delivery, coordination, and client communication.",
    projects: appBarProjects,
  },
  {
    id: "freelancer",
    title: "Freelancer",
    eyebrow: "2025 - 2026 · Technical Project Manager",
    description: "Contracted client projects managed from planning through launch.",
    role: "Technical Project Manager leading timelines, scope, and cross-functional delivery.",
    projects: freelancerProjects,
  },
  {
    id: "personal",
    title: "Personal",
    eyebrow: "2022 - 2025 · Independent Projects",
    description: "Self-directed apps and experiments built to explore new ideas.",
    role: "Independent builds focused on full-stack product ideas and technical exploration.",
    projects: personalProjects,
  },
];
