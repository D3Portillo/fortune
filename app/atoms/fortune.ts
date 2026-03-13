import { atomWithStorage } from "jotai/utils"
import { FORTUNES } from "@/app/lib/fortunes"

/**
 * Returns the local claim-day key as "YYYY-MM-DD".
 * The claim day rolls over at 01:00 (1AM), not midnight.
 */
export function getClaimDayString(): string {
  const d = new Date()
  if (d.getHours() < 1) {
    d.setDate(d.getDate() - 1)
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export type FortuneState = {
  /** Index into the FORTUNES array (null = never set) */
  index: number | null
  /** Claim-day key "YYYY-MM-DD" of the last generated fortune (1AM rollover) */
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
  undefined,
  { getOnInit: true },
)

/** Derive the message from a FortuneState (returns empty string if unset). */
export function getFortuneMessage(state: FortuneState): string {
  if (state.index === null) return ""
  return FORTUNES[state.index] ?? ""
}
