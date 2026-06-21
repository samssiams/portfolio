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

const SPEECH_ABBREVIATIONS = new Set([
  "dr",
  "e.g",
  "etc",
  "i.e",
  "jr",
  "mr",
  "mrs",
  "ms",
  "prof",
  "sr",
  "st",
  "vs",
]);

export function splitSpeechSentences(text: string) {
  const sentences: string[] = [];
  let sentenceStart = 0;

  for (let index = 0; index < text.length; index += 1) {
    const punctuation = text[index];
    if (punctuation !== "." && punctuation !== "!" && punctuation !== "?") continue;

    const nextCharacter = text[index + 1];
    if (nextCharacter && !/\s/.test(nextCharacter)) continue;

    if (punctuation === ".") {
      const precedingText = text.slice(sentenceStart, index);
      const token = precedingText.match(/([A-Za-z.]+)$/)?.[1]?.toLowerCase() ?? "";
      const isInitialism = /^(?:[a-z]\.)+[a-z]$/.test(token);
      if (SPEECH_ABBREVIATIONS.has(token) || isInitialism) continue;

      const nextWord = text.slice(index + 1).trimStart();
      if (nextWord && /^[a-z]/.test(nextWord)) continue;
    }

    const sentence = text.slice(sentenceStart, index + 1).trim();
    if (sentence) sentences.push(sentence);
    sentenceStart = index + 1;
  }

  const remainder = text.slice(sentenceStart).trim();
  if (remainder) sentences.push(remainder);

  return sentences.length > 0 ? sentences : [text];
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
