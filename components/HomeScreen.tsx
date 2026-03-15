"use client"

import { useState, useEffect, Fragment, type PointerEvent } from "react"
import { useWorldAuth } from "@radish-la/world-auth"
import confetti from "canvas-confetti"

import { useCookieAnimation } from "@/app/hooks/useCookieAnimation"
import { useFortuneState } from "@/app/hooks/useFortuneState"
import { isConnectedOrDevEnv } from "@/app/lib/env"
import { cn, toChinaNumeral } from "@/app/lib/utils"
import { getClaimDayString, getFortuneMessage } from "@/app/atoms/fortune"
import { pickFortuneIndex } from "@/app/lib/fortunes"

import { CookieAnimation } from "./CookieAnimation"
import { FortuneReveal } from "./FortuneReveal"
import { TopNav } from "./TopNav"
import { ActionClaimWithModal } from "./ActionClaimWithModal"

function getSecondsUntilNextClaimReset() {
  const now = new Date()
  const nextReset = new Date(now)
  nextReset.setHours(1, 0, 0, 0)

  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1)
  }

  return Math.floor((nextReset.getTime() - now.getTime()) / 1000)
}

function formatCountdown(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

type Stage = "idle" | "breaking" | "broken" | "reveal"

const MAX_LUCKY_NUMBER = 9

export function HomeScreen() {
  const { address, signIn } = useWorldAuth()
  const [showCookieFlow, setShowCookieFlow] = useState(false)
  const [stage, setStage] = useState<Stage>("idle")
  const [countdown, setCountdown] = useState(getSecondsUntilNextClaimReset)
  const [cookiesEarned, setCookiesEarned] = useState(0)
  const [fortuneState, setFortuneState] = useFortuneState()

  const {
    idleFrame,
    crackFrame,
    cookieLayerVisible,
    revealVisible,
    audioRef,
    resetCrackFrame,
  } = useCookieAnimation(showCookieFlow ? stage : "idle")

  // Cookie has been broken today if the stored date matches today
  const hasBroken =
    fortuneState.date !== null && fortuneState.date === getClaimDayString()

  const fortuneData = {
    message: getFortuneMessage(fortuneState),
    cookiesEarned,
    luckyNumber: fortuneState.luckyNumber,
  }

  // Countdown tick
  useEffect(() => {
    if (!hasBroken) return
    const id = setInterval(
      () => setCountdown(getSecondsUntilNextClaimReset()),
      1000,
    )
    return () => clearInterval(id)
  }, [hasBroken])

  // Auto-transition from broken to reveal — also generate and persist the fortune
  useEffect(() => {
    if (!showCookieFlow || stage !== "broken") return
    const newIndex = pickFortuneIndex(fortuneState.index)
    const newCookiesEarned = Math.round(1 + Math.random() * 4)
    setCookiesEarned(newCookiesEarned)
    setFortuneState({
      index: newIndex,
      date: getClaimDayString(),
      luckyNumber: (newIndex % MAX_LUCKY_NUMBER) + 1,
      totalCookiesEarned:
        (fortuneState.totalCookiesEarned ?? 0) + newCookiesEarned,
    })
    const timer = setTimeout(() => setStage("reveal"), 100)
    return () => clearTimeout(timer)
  }, [showCookieFlow, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-transition when crack animation completes
  useEffect(() => {
    if (!showCookieFlow || stage !== "breaking") return
    if (crackFrame >= 9) {
      setStage("broken")
    }
  }, [showCookieFlow, stage, crackFrame])

  const handleStartCookieFlow = () => {
    if (!isConnectedOrDevEnv(address)) return signIn()
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
  }

  const handleClaimSuccess = () => {
    setCountdown(0)
    setFortuneState({ ...fortuneState, date: null })
    setShowCookieFlow(true)
    setStage("breaking")
    resetCrackFrame()
    audioRef.current?.play()
  }

  const handleFortuneAreaTap = (event: PointerEvent<HTMLDivElement>) => {
    // Don't trigger if modal open or fortune not broken (Revealed)
    if (!hasBroken || document.querySelector("[data-scroll-locked]")) return

    const origin = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    }

    confetti({
      particleCount: 12,
      spread: 45,
      startVelocity: 26,
      gravity: 1.1,
      ticks: 90,
      scalar: 0.8,
      origin,
      shapes: ["square", "circle"],
      colors: ["#fcab40", "#f0f757", "#ffd28f", "#fff4df"],
    })

    confetti({
      particleCount: 6,
      spread: 24,
      startVelocity: 18,
      gravity: 0.95,
      ticks: 75,
      scalar: 1,
      origin,
      shapes: ["square"],
      colors: ["#fff4df", "#fcab40"],
    })
  }

  return (
    <Fragment>
      <audio ref={audioRef} src="/fortune/crack-sound.mp3" preload="auto" />

      <div
        onPointerDown={hasBroken ? handleFortuneAreaTap : undefined}
        className={cn(
          "absolute select-none inset-0 flex flex-col",
          hasBroken
            ? "bg-amber-50"
            : "bg-linear-to-b from-amber-50 via-amber-100 to-amber-50",
        )}
      >
        {/* ── Top nav ── */}
        <TopNav />

        {/* ── Middle: title + cookie or fortune — all centered ── */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center w-full max-w-xs">
            {/* Title */}
            <div className={cn("text-center", hasBroken ? "mb-4" : "mb-10")}>
              {hasBroken ? null : (
                <h1 className="text-4xl font-fortune font-bold text-black/85 tracking-tight">
                  What's your fortune today?
                </h1>
              )}

              <p className="mt-2 text-xs text-black/35 tracking-widest uppercase">
                {hasBroken ? "Today's fortune" : "Break the cookie to find out"}
              </p>
            </div>
            {hasBroken ? (
              <Fragment>
                {/* Fortune message */}
                <div className="relative text-center mb-8">
                  <span className="absolute -rotate-12 -left-2 -top-2 text-5xl text-of-orange leading-none select-none">
                    &ldquo;
                  </span>
                  <p className="text-lg text-black/70 leading-relaxed px-4 font-fortune">
                    {fortuneData.message}
                  </p>
                  <span className="absolute rotate-12 -right-2 -bottom-5 text-5xl text-of-orange leading-none select-none">
                    &rdquo;
                  </span>
                </div>

                {/* Lucky number */}
                <div className="flex flex-col items-center">
                  <p className="text-xs tracking-widest uppercase text-black/25 mb-3">
                    YOUR LUCKY NUMBER
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-china text-7xl text-black/80 leading-none">
                      {toChinaNumeral(fortuneData.luckyNumber)}
                    </span>
                    <span className="text-2xl text-black/20 font-light tabular-nums">
                      {fortuneData.luckyNumber}
                    </span>
                  </div>
                </div>
              </Fragment>
            ) : (
              /* Cookie + CTA */
              <button
                onClick={handleStartCookieFlow}
                className="group flex flex-col items-center focus:outline-none active:opacity-70"
              >
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

                <span className="flex items-center gap-2 font-fortune text-xl text-black/65 transition-colors group-hover:text-black/90">
                  <span>Tap to break</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        {/* ── Bottom: clock card ── */}
        <div className="px-6 py-10">
          {hasBroken && (
            <div className="flex items-center justify-between px-5 py-4 bg-white/60 rounded-2xl border border-black/6">
              <div className="flex flex-col">
                <p className="text-xs tracking-widest uppercase text-black/25 mb-0.5">
                  MORE COOKIES IN
                </p>

                <p className="font-mono text-2xl text-black/60 tabular-nums tracking-tight leading-none">
                  {formatCountdown(countdown)}
                </p>
              </div>
              <ActionClaimWithModal onClaimSuccess={handleClaimSuccess} />
            </div>
          )}
        </div>
      </div>

      {showCookieFlow && (
        <Fragment>
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
        </Fragment>
      )}
    </Fragment>
  )
}
