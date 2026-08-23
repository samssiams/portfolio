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
    description: "Projects I managed across mobile and web.",
    role: "Project Manager supporting delivery, coordination, and client communication.",
    projects: appBarProjects,
  },
  {
    id: "freelancer",
    title: "Freelancer.com",
    eyebrow: "2025 - 2026 · Technical Project Manager",
    description: "Client projects I managed as part of the Freelancer.com team.",
    role: "Technical Project Manager leading timelines, scope, and cross-functional delivery.",
    projects: freelancerProjects,
  },
  {
    id: "personal",
    title: "Personal",
    eyebrow: "2022 - 2025 · Independent Projects",
    description: "Projects I built independently to explore new ideas.",
    role: "Independent builds focused on full-stack product ideas and technical exploration.",
    projects: personalProjects,
  },
];
