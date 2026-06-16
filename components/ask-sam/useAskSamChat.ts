import { FormEvent, useEffect, useRef, useState } from "react";
import { PAGE_CONTENT, getRandomGreeting } from "./content";
import {
  FEMALE_VOICE_NAMES,
  GREETING_REFRESH_COUNT_STORAGE_KEY,
  GREETING_REFRESH_RESET_COUNT,
  GREETING_SPOKEN_STORAGE_KEY,
  MEETING_TOKEN,
  MIN_RESPONSE_DELAY_MS,
  NATURAL_SPEECH_RATE,
  RESUME_TOKEN,
  SENTENCE_PAUSE_MS,
  SPAM_COOLDOWN_MS,
  UNCLEAR_MESSAGE_REPLY,
} from "./constants";
import type { Message, PageLabel, QueuedMessage } from "./types";
import { isLikelyUnclearMessage, wait } from "./speech-utils";

export function useAskSamChat(pageLabel: PageLabel) {
  const pageContent = PAGE_CONTENT[pageLabel];
  const greetingRef = useRef(getRandomGreeting(pageContent.greetings));
  const initialMessage: Message = {
    role: "assistant",
    content: greetingRef.current,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [spamWarning, setSpamWarning] = useState<string | null>(null);
  const [portfolioTip, setPortfolioTip] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [hasFemaleVoice, setHasFemaleVoice] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [spamCooldownSeconds, setSpamCooldownSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<Message[]>([initialMessage]);
  const messageQueueRef = useRef<QueuedMessage[]>([]);
  const isProcessingRef = useRef(false);
  const pendingCountRef = useRef(0);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spamCooldownUntilRef = useRef(0);
  const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVoiceEnabledRef = useRef(true);
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const greetingSpokenRef = useRef(false);
  const portfolioTipShownRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    }

    function handleWindowBlur() {
      setIsShiftPressed(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem(GREETING_SPOKEN_STORAGE_KEY) !== "true") {
      localStorage.setItem(GREETING_REFRESH_COUNT_STORAGE_KEY, "0");
      return;
    }

    const refreshCount =
      Number.parseInt(localStorage.getItem(GREETING_REFRESH_COUNT_STORAGE_KEY) ?? "0", 10) + 1;

    if (refreshCount >= GREETING_REFRESH_RESET_COUNT) {
      localStorage.removeItem(GREETING_SPOKEN_STORAGE_KEY);
      localStorage.setItem(GREETING_REFRESH_COUNT_STORAGE_KEY, "0");
      greetingSpokenRef.current = false;
      return;
    }

    localStorage.setItem(GREETING_REFRESH_COUNT_STORAGE_KEY, String(refreshCount));
  }, []);

  useEffect(() => {
    if (spamCooldownSeconds <= 0) return;

    const interval = setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((spamCooldownUntilRef.current - Date.now()) / 1000)
      );

      setSpamCooldownSeconds(remainingSeconds);

      if (remainingSeconds <= 0) {
        setSpamWarning(null);
        spamCooldownUntilRef.current = 0;
      } else {
        setSpamWarning(`Please wait ${remainingSeconds} seconds before sending another message.`);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [spamCooldownSeconds]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (greetingTimeoutRef.current) {
          clearTimeout(greetingTimeoutRef.current);
          greetingTimeoutRef.current = null;
        }
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        setIsSpeechActive(false);
        greetingSpokenRef.current = true;
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;

    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }
    if (speechPauseTimeoutRef.current) {
      clearTimeout(speechPauseTimeoutRef.current);
      speechPauseTimeoutRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsSpeechActive(false);
  }, [isOpen]);

  useEffect(() => {
    if (pageLabel !== "Portfolio" || !isOpen || portfolioTipShownRef.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    portfolioTipShownRef.current = true;
    setPortfolioTip("Tip: Hold Shift and click a project to ask Isabel about it.");
  }, [isOpen, pageLabel]);

  useEffect(() => {
    if (isOpen && hasFemaleVoice && isVoiceEnabled && !greetingSpokenRef.current) {
      if (localStorage.getItem(GREETING_SPOKEN_STORAGE_KEY) === "true") {
        greetingSpokenRef.current = true;
        return;
      }

      greetingSpokenRef.current = true;
      greetingTimeoutRef.current = setTimeout(() => {
        greetingTimeoutRef.current = null;
        localStorage.setItem(GREETING_SPOKEN_STORAGE_KEY, "true");
        speakReply(greetingRef.current);
      }, 1500);
    }

    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
    };
  }, [hasFemaleVoice, isOpen, isVoiceEnabled]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    function loadFemaleVoice() {
      const femaleVoice =
        window.speechSynthesis
          .getVoices()
          .find(
            (voice) =>
              voice.lang.toLowerCase().startsWith("en") && FEMALE_VOICE_NAMES.test(voice.name)
          ) ?? null;

      femaleVoiceRef.current = femaleVoice;
      setHasFemaleVoice(Boolean(femaleVoice));
    }

    loadFemaleVoice();
    window.speechSynthesis.addEventListener("voiceschanged", loadFemaleVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadFemaleVoice);
  }, []);

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
      }
      if (speechPauseTimeoutRef.current) {
        clearTimeout(speechPauseTimeoutRef.current);
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  function stopSpeaking() {
    if (speechPauseTimeoutRef.current) {
      clearTimeout(speechPauseTimeoutRef.current);
      speechPauseTimeoutRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsSpeechActive(false);
  }

  function pauseSpeaking() {
    window.speechSynthesis?.pause();
    setIsSpeaking(false);
    setIsSpeechActive(false);
  }

  function resumeSpeaking() {
    window.speechSynthesis?.resume();
    setIsSpeaking(window.speechSynthesis?.speaking ?? false);
    setIsSpeechActive(window.speechSynthesis?.speaking ?? false);
  }

  function speakReply(content: string) {
    if (!isVoiceEnabledRef.current || !("speechSynthesis" in window)) return;

    const spokenText = content
      .replace(RESUME_TOKEN, "")
      .replace(MEETING_TOKEN, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!spokenText) return;

    const preferredVoice = femaleVoiceRef.current;
    if (!preferredVoice) return;

    const sentences = spokenText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [spokenText];
    setIsSpeechActive(true);
    if (speechPauseTimeoutRef.current) {
      clearTimeout(speechPauseTimeoutRef.current);
      speechPauseTimeoutRef.current = null;
    }

    function finishSpeaking() {
      if (speechPauseTimeoutRef.current) {
        clearTimeout(speechPauseTimeoutRef.current);
        speechPauseTimeoutRef.current = null;
      }
      setIsSpeaking(false);
      setIsSpeechActive(false);
    }

    function speakSentence(index: number) {
      const sentence = sentences[index];
      if (!sentence) {
        finishSpeaking();
        return;
      }

      const isLastSentence = index === sentences.length - 1;
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.voice = preferredVoice;
      utterance.rate = NATURAL_SPEECH_RATE;
      utterance.pitch = 1;
      utterance.volume = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onerror = finishSpeaking;
      utterance.onend = () => {
        if (isLastSentence) {
          finishSpeaking();
          return;
        }

        setIsSpeaking(false);
        speechPauseTimeoutRef.current = setTimeout(() => {
          speechPauseTimeoutRef.current = null;
          speakSentence(index + 1);
        }, SENTENCE_PAUSE_MS);
      };

      window.speechSynthesis.speak(utterance);
    }

    speakSentence(0);
  }

  function toggleVoice() {
    if (!hasFemaleVoice) {
      showVoiceWarning();
      return;
    }

    const nextValue = !isVoiceEnabledRef.current;
    isVoiceEnabledRef.current = nextValue;
    setIsVoiceEnabled(nextValue);

    if (nextValue) {
      resumeSpeaking();
    } else {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
      pauseSpeaking();
    }
  }

  function showVoiceWarning() {
    setSpamWarning("A female English voice is not available on this device.");

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setSpamWarning(null);
    }, 3500);
  }

  function showSpamWarning() {
    if (Date.now() >= spamCooldownUntilRef.current) {
      spamCooldownUntilRef.current = Date.now() + SPAM_COOLDOWN_MS;
    }

    const remainingSeconds = Math.max(
      1,
      Math.ceil((spamCooldownUntilRef.current - Date.now()) / 1000)
    );
    setSpamCooldownSeconds(remainingSeconds);
    setSpamWarning(`Please wait ${remainingSeconds} seconds before sending another message.`);

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setSpamWarning(null);
      spamCooldownUntilRef.current = 0;
      setSpamCooldownSeconds(0);
    }, SPAM_COOLDOWN_MS);
  }

  async function processMessageQueue() {
    if (isProcessingRef.current) return;

    const nextMessage = messageQueueRef.current.shift();
    if (!nextMessage) return;

    isProcessingRef.current = true;
    setIsLoading(true);

    const visibleUserMessage: Message = { role: "user", content: nextMessage.displayText };
    const requestUserMessage: Message = { role: "user", content: nextMessage.requestText };
    const visibleMessages = [...conversationRef.current, visibleUserMessage];
    const requestMessages = [...conversationRef.current, requestUserMessage];
    const startedAt = Date.now();

    try {
      if (isLikelyUnclearMessage(nextMessage.displayText)) {
        await wait(MIN_RESPONSE_DELAY_MS);

        const assistantMessage: Message = {
          role: "assistant",
          content: UNCLEAR_MESSAGE_REPLY,
        };
        conversationRef.current = [...visibleMessages, assistantMessage];
        setMessages((prev) => [...prev, assistantMessage]);
        speakReply(assistantMessage.content);
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages, currentPage: pageLabel }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Hmm, I didn't get a response. Try again?",
      };
      await wait(Math.max(0, MIN_RESPONSE_DELAY_MS - (Date.now() - startedAt)));
      conversationRef.current = [...visibleMessages, assistantMessage];
      setMessages((prev) => [...prev, assistantMessage]);
      speakReply(assistantMessage.content);
    } catch (err) {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "I'm having trouble reaching my response service right now. Please try again in a moment.",
      };
      await wait(Math.max(0, MIN_RESPONSE_DELAY_MS - (Date.now() - startedAt)));
      conversationRef.current = [...visibleMessages, assistantMessage];
      setMessages((prev) => [...prev, assistantMessage]);
      speakReply(assistantMessage.content);
    } finally {
      pendingCountRef.current -= 1;
      isProcessingRef.current = false;

      if (messageQueueRef.current.length > 0) {
        void processMessageQueue();
      } else {
        setIsLoading(false);
      }
    }
  }

  function sendMessage(text: string, displayText = text) {
    const trimmedText = text.trim();
    const trimmedDisplayText = displayText.trim();
    if (!trimmedText) return;

    if (Date.now() < spamCooldownUntilRef.current) {
      showSpamWarning();
      return;
    }

    if (pendingCountRef.current >= 2) {
      showSpamWarning();
      return;
    }

    stopSpeaking();
    greetingSpokenRef.current = true;
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }
    pendingCountRef.current += 1;
    messageQueueRef.current.push({
      requestText: trimmedText,
      displayText: trimmedDisplayText || trimmedText,
    });
    setMessages((prev) => [...prev, { role: "user", content: trimmedDisplayText || trimmedText }]);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
    void processMessageQueue();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function toggleChat() {
    setIsOpen((prev) => {
      if (prev) {
        if (greetingTimeoutRef.current) {
          clearTimeout(greetingTimeoutRef.current);
          greetingTimeoutRef.current = null;
        }
        greetingSpokenRef.current = true;
        stopSpeaking();
      }
      return !prev;
    });
  }

  useEffect(() => {
    function handleProjectQuestion(event: Event) {
      const detail = (event as CustomEvent<{ question?: string; displayText?: string }>).detail;
      const question = detail?.question;
      if (!question) return;

      setPortfolioTip(null);
      setIsOpen(true);
      sendMessage(question, detail?.displayText);
    }

    window.addEventListener("ask-isabel-about-project", handleProjectQuestion);
    return () => window.removeEventListener("ask-isabel-about-project", handleProjectQuestion);
  });

  const inputPlaceholder =
    spamCooldownSeconds > 0
      ? `Please wait ${spamCooldownSeconds}s...`
      : isShiftPressed
        ? "Click on a project..."
        : "Ask something...";
  const isSpamCoolingDown = spamCooldownSeconds > 0;

  return {
    pageContent,
    isOpen,
    messages,
    input,
    setInput,
    isLoading,
    spamWarning,
    portfolioTip,
    isVoiceEnabled,
    isSpeaking,
    isSpeechActive,
    hasFemaleVoice,
    isShiftPressed,
    scrollRef,
    inputRef,
    inputPlaceholder,
    isSpamCoolingDown,
    handleSubmit,
    sendMessage,
    toggleChat,
    toggleVoice,
  };
}
