import type { Message } from "./types";
import { MEETING_TOKEN, MEETING_URL, RESUME_TOKEN, RESUME_URL } from "./constants";
import { tealButtonStyle } from "./styles";
import { CalendarIcon, DownloadIcon } from "./icons";

export function MessageContent({ message }: { message: Message }) {
  if (message.role !== "assistant") {
    return <>{message.content}</>;
  }

  const hasResumeLink = message.content.includes(RESUME_TOKEN);
  const hasMeetingLink = message.content.includes(MEETING_TOKEN);

  if (!hasResumeLink && !hasMeetingLink) {
    return <>{message.content}</>;
  }

  const text = message.content
    .replace(RESUME_TOKEN, "")
    .replace(MEETING_TOKEN, "")
    .trim();

  return (
    <div className="space-y-3">
      {text && <p>{text}</p>}
      <div className="flex flex-wrap gap-2">
        {hasResumeLink && (
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.3px] transition-all duration-200"
            style={tealButtonStyle}
          >
            <DownloadIcon />
            Download resume
          </a>
        )}
        {hasMeetingLink && (
          <a
            href={MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.3px] transition-all duration-200"
            style={tealButtonStyle}
          >
            <CalendarIcon />
            Book a meeting
          </a>
        )}
      </div>
    </div>
  );
}
