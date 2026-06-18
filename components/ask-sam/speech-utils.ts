export function isPhoneOrTablet() {
  const userAgent = navigator.userAgent;
  const isMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isIPadInDesktopMode = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;

  return isMobileUserAgent || isIPadInDesktopMode;
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatTextForSpeech(text: string) {
  return text.replace(/\bsamssiams\.work@gmail\.com\b/gi, "samshams dot work at gmail dot com");
}

export function isLikelyUnclearMessage(message: string) {
  const compactMessage = message.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (compactMessage.length < 8) return false;

  const words = message.trim().split(/\s+/);
  const hasRecognizableSeparator = words.length > 1 || /[?.!,]/.test(message);
  const vowelCount = (compactMessage.match(/[aeiou]/g) ?? []).length;
  const vowelRatio = vowelCount / compactMessage.length;
  const hasLongConsonantRun = /[bcdfghjklmnpqrstvwxyz]{7,}/i.test(compactMessage);

  return !hasRecognizableSeparator && (vowelRatio < 0.25 || hasLongConsonantRun);
}
