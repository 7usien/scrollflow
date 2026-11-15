// src/core/reading.ts — Pure reading estimation & metrics (FR-09)
import { WORDS_PER_MINUTE } from '../shared/types';

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(
  wordCount: number,
  wpm: number = WORDS_PER_MINUTE
): number {
  if (wordCount <= 0 || wpm <= 0) return 1;
  const minutes = Math.round(wordCount / wpm);
  return Math.max(1, minutes);
}

export function screensOf(docHeight: number, viewportH: number): number {
  if (viewportH <= 0) return 0;
  return docHeight / viewportH;
}
