"use client"

import { useState, useEffect } from "react"
import { CookieAnimation } from "./CookieAnimation"
import { FortuneReveal } from "./FortuneReveal"
import { useCookieAnimation } from "@/app/hooks/useCookieAnimation"

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
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

type Stage = "idle" | "breaking" | "broken" | "reveal"

export function HomeScreen() {
  const [showCookieFlow, setShowCookieFlow] = useState(false)
  const [stage, setStage] = useState<Stage>("idle")
  const [hasBroken, setHasBroken] = useState(false)
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight)
  const {
    idleFrame,
    crackFrame,
    cookieLayerVisible,
    revealVisible,
    audioRef,
    resetCrackFrame,
  } = useCookieAnimation(showCookieFlow ? stage : "idle")

  // Mock data - will come from backend later
  const fortuneData = {
    message: "Your patience today will bring unexpected rewards tomorrow",
    chipsEarned: 3,
    luckyNumber: 7,
  }

  // Countdown tick
  useEffect(() => {
    if (!hasBroken) return
    const id = setInterval(() => setCountdown(getSecondsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [hasBroken])

  // Auto-transition from broken to reveal
  useEffect(() => {
    if (!showCookieFlow || stage !== "broken") return
    const timer = setTimeout(() => setStage("reveal"), 100)
    return () => clearTimeout(timer)
  }, [showCookieFlow, stage])

  // Auto-transition when crack animation completes
  useEffect(() => {
    if (!showCookieFlow || stage !== "breaking") return
    if (crackFrame >= 9) {
      setStage("broken")
    }
  }, [showCookieFlow, stage, crackFrame])

  const handleStartCookieFlow = () => {
    setShowCookieFlow(true)
    setStage("idle")
  }

  const handleBreakCookie = () => {
    if (stage !== "idle") return
    setStage("breaking")
    resetCrackFrame()
    audioRef.current?.play()
  }

  const handleBackHome = () => {
    setShowCookieFlow(false)
    setStage("idle")
    setHasBroken(true)
  }

  return (
    <>
      <audio ref={audioRef} src="/fortune/crack-sound.mp3" preload="auto" />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-b from-amber-50 via-amber-100 to-amber-50">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto px-6">
          {/* Title */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-semibold text-black/85 tracking-tight">
              Fortune Cookie
            </h1>
            <p className="mt-2 text-xs text-black/35 tracking-widest uppercase">
              {hasBroken ? "Today's fortune" : "Break one, see what\u2019s inside"}
            </p>
          </div>

          {hasBroken ? (
            /* ── Broken state: fortune summary ── */
            <div className="flex flex-col items-center w-full max-w-xs">
              {/* Fortune message */}
              <div className="relative text-center mb-10">
                <span className="absolute -rotate-12 -left-2 -top-2 text-5xl text-of-orange/20 leading-none select-none">&ldquo;</span>
                <p className="text-lg text-black/70 leading-relaxed px-4 font-fortune">
                  {fortuneData.message}
                </p>
                <span className="absolute rotate-12 -right-2 -bottom-5 text-5xl text-of-orange/20 leading-none select-none">&rdquo;</span>
              </div>

              {/* Lucky number */}
              <div className="flex flex-col items-center mb-10">
                <p className="text-xs tracking-widest uppercase text-black/25 mb-3">Lucky Number</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-fortune text-7xl text-black/80 leading-none">
                    {CHINESE_NUMERALS[(fortuneData.luckyNumber - 1) % 9]}
                  </span>
                  <span className="text-2xl text-black/20 font-light tabular-nums">
                    {fortuneData.luckyNumber}
                  </span>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex flex-col items-center">
                <p className="text-xs tracking-widest uppercase text-black/25 mb-1">Next fortune in</p>
                <p className="font-mono text-xl text-black/40 tabular-nums tracking-tight">
                  {formatCountdown(countdown)}
                </p>
              </div>
            </div>
          ) : (
            /* ── Default state: cookie + CTA ── */
            <button
              onClick={handleStartCookieFlow}
              className="group flex flex-col items-center gap-0 focus:outline-none active:opacity-70"
            >
              {/* Cookie — scale breathe */}
              <div className="mb-16 animate-cookie-breathe">
                <div
                  style={{
                    width: "240px",
                    height: "240px",
                    backgroundImage: "url(/fortune/cookie.png)",
                    backgroundPosition: "0 0",
                    backgroundSize: "240px 2400px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>

              {/* CTA text */}
              <span className="flex items-center gap-2 font-fortune text-xl text-black/65 transition-colors group-hover:text-black/90">
                <span>Tap to break</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          )}


        </div>
      </div>

      {showCookieFlow && (
        <>
          {cookieLayerVisible && (
            <CookieAnimation
              stage={stage}
              idleFrame={idleFrame}
              crackFrame={crackFrame}
              onTap={handleBreakCookie}
            />
          )}

          {stage === "reveal" && (
            <FortuneReveal
              fortuneData={fortuneData}
              isVisible={revealVisible}
              onBackHome={handleBackHome}
            />
          )}
        </>
      )}
    </>
  )
}
