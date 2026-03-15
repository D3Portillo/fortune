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
  /** Lifetime total cookies earned across all sessions */
  totalCookiesEarned: number
}

export const DEFAULT_FORTUNE_STATE: FortuneState = {
  index: null,
  date: null,
  luckyNumber: 7,
  totalCookiesEarned: 0,
}

export type FortuneStateMap = Record<string, FortuneState>

/**
 * Persisted atom that stores fortune states keyed by wallet address.
 * Backed by localStorage under the key "fortune:daily".
 */
export const dailyFortuneAtom = atomWithStorage<FortuneStateMap>(
  "fortune:daily",
  {},
  undefined,
  { getOnInit: true },
)

/** Returns the fortune state for a given address, falling back to defaults. */
export function getFortuneState(
  map: FortuneStateMap,
  address: string | undefined,
): FortuneState {
  return address && map[address] ? map[address] : DEFAULT_FORTUNE_STATE
}

/** Derive the message from a FortuneState (returns empty string if unset). */
export function getFortuneMessage(state: FortuneState): string {
  if (state.index === null) return ""
  return FORTUNES[state.index] ?? ""
}
