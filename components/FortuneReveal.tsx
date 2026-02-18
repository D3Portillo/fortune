"use client"

import { useEffect, useState } from "react"
import { cn } from "@/app/lib/utils"

const CHINESE_NUMERALS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"]

function getSecondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function formatCountdown(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].join(":")
}

type FortuneData = {
  message: string
  chipsEarned: number
  luckyNumber: number
}

type FortuneRevealProps = {
  fortuneData: FortuneData
  isVisible: boolean
  onBackHome: () => void
}

export function FortuneReveal({
  fortuneData,
  isVisible,
  onBackHome,
}: FortuneRevealProps) {
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight)

  useEffect(() => {
    const id = setInterval(
      () => setCountdown(getSecondsUntilMidnight()),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  const chineseNumeral =
    CHINESE_NUMERALS[(fortuneData.luckyNumber - 1) % 9]

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm">
      <div
        className={cn(
          "h-full w-full max-w-md mx-auto px-8 flex flex-col pt-16 pb-10 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
      >
        {/* Fortune message */}
        <div className="relative text-center mb-14">
          <span className="absolute -rotate-12 -left-2 -top-3 text-6xl text-of-orange/20 leading-none select-none">
            &ldquo;
          </span>
          <p className="text-2xl text-black/80 leading-relaxed px-6 font-fortune">
            {fortuneData.message}
          </p>
          <span className="absolute rotate-12 -right-2 -bottom-6 text-6xl text-of-orange/20 leading-none select-none">
            &rdquo;
          </span>
        </div>

        {/* Lucky number */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-xs tracking-widest uppercase text-black/30 mb-4">
            Lucky Number
          </p>
          <div className="flex items-baseline gap-4">
            <span className="font-fortune text-8xl text-black/85 leading-none">
              {chineseNumeral}
            </span>
            <span className="text-3xl text-black/25 font-light tabular-nums">
              {fortuneData.luckyNumber}
            </span>
          </div>
        </div>

        {/* Chips earned */}
        <div className="flex items-center justify-between py-4 px-6 bg-white/60 rounded-2xl border border-black/5">
          <span className="text-sm text-black/60">Cookie chips earned</span>
          <span className="text-base font-medium text-of-orange">
            +{fortuneData.chipsEarned}
          </span>
        </div>

        <div className="grow" />

        {/* Countdown */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-xs tracking-widest uppercase text-black/25 mb-2">
            Next fortune in
          </p>
          <p className="font-mono text-2xl text-black/45 tabular-nums tracking-tight">
            {formatCountdown(countdown)}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onBackHome}
          className="w-full text-center text-sm text-black/30 font-fortune transition-colors hover:text-black/55 active:opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  )
}
