export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type QueuedMessage = {
  requestText: string;
  displayText: string;
};

export type PageLabel = "Home" | "Portfolio" | "Photography";
