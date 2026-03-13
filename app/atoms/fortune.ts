import { atomWithStorage } from "jotai/utils"
import { FORTUNES } from "@/app/lib/fortunes"

/** Returns today's date as a "YYYY-MM-DD" string in local time. */
export function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export type FortuneState = {
  /** Index into the FORTUNES array (null = never set) */
  index: number | null
  /** Date string "YYYY-MM-DD" of the day the fortune was last generated */
  date: string | null
  /** Lucky number associated with this fortune */
  luckyNumber: number
  /** Chips earned when breaking the cookie */
  chipsEarned: number
}

const DEFAULT_FORTUNE_STATE: FortuneState = {
  index: null,
  date: null,
  luckyNumber: 7,
  chipsEarned: 3,
}

/**
 * Persisted atom that stores the current daily fortune state.
 * Backed by localStorage under the key "fortune:daily".
 */
export const dailyFortuneAtom = atomWithStorage<FortuneState>(
  "fortune:daily",
  DEFAULT_FORTUNE_STATE,
)

/** Derive the message from a FortuneState (returns empty string if unset). */
export function getFortuneMessage(state: FortuneState): string {
  if (state.index === null) return ""
  return FORTUNES[state.index] ?? ""
}
