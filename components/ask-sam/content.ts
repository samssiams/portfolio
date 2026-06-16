import type { PageLabel } from "./types";

export const PAGE_CONTENT: Record<
  PageLabel,
  { greetings: string[]; suggestions: string[] }
> = {
  Home: {
    greetings: [
      "Hello! I'm Isabel. Ask me anything about Sam's experience, projects, skills, or availability.",
      "Hi, I'm Isabel. I can help with Sam's projects, skills, experience, or availability.",
      "Hey there, I'm Isabel. Ask me anything you'd like to know about Sam's work.",
    ],
    suggestions: [
      "What projects has he worked on?",
      "Is he available for freelance work?",
      "May I schedule a meeting with him?",
    ],
  },
  Portfolio: {
    greetings: [
      "Hello! I'm Isabel. I can tell you more about the projects you're exploring or Sam's role in building them.",
      "Hi, I'm Isabel. I can walk you through Sam's projects and what he built in each one.",
      "Hey, I'm Isabel. Ask me about any project here, the tech behind it, or Sam's role.",
    ],
    suggestions: [
      "Which project best shows Sam's skills?",
      "What technologies does Sam work with?",
      "What was Sam's role in these projects?",
    ],
  },
  Photography: {
    greetings: [
      "Hello! I'm Isabel. I can tell you more about Sam's photography and the work you're viewing.",
      "Hi, I'm Isabel. Ask me about Sam's photography, creative background, or booking details.",
      "Hey there, I'm Isabel. I can help you explore Sam's photography work.",
    ],
    suggestions: [
      "What kind of photography does Sam shoot?",
      "Tell me about Sam's creative background.",
      "How can I contact Sam for photography?",
    ],
  },
};

export function getRandomGreeting(greetings: string[]) {
  return greetings[Math.floor(Math.random() * greetings.length)] ?? greetings[0];
}
