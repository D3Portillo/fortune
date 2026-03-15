"use client"

import { useAtom } from "jotai"
import { useWorldAuth } from "@radish-la/world-auth"
import {
  dailyFortuneAtom,
  getFortuneState,
  type FortuneState,
} from "@/app/atoms/fortune"

export function useFortuneState() {
  const { address } = useWorldAuth()
  const ACCOUNT = address || "0x0" // Use a dummy key for unauthenticated users

  const [fortuneMap, setFortuneMap] = useAtom(dailyFortuneAtom)
  const fortuneState = getFortuneState(fortuneMap, ACCOUNT)

  const setFortuneState = (
    update: FortuneState | ((prev: FortuneState) => FortuneState),
  ) => {
    setFortuneMap((prev) => ({
      ...prev,
      [ACCOUNT]:
        typeof update === "function"
          ? update(getFortuneState(prev, ACCOUNT))
          : update,
    }))
  }

  return [fortuneState, setFortuneState] as const
}
