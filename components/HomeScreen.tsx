"use client"

import { useState, useEffect } from "react"
import { CookieAnimation } from "./CookieAnimation"
import { FortuneReveal } from "./FortuneReveal"
import { useCookieAnimation } from "@/app/hooks/useCookieAnimation"

type Stage = "idle" | "breaking" | "broken" | "reveal"

export function HomeScreen() {
  const [showCookieFlow, setShowCookieFlow] = useState(false)
  const [stage, setStage] = useState<Stage>("idle")
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
    tokensEarned: 3,
    hasDiscount: true,
    discountPercent: 20,
  }

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
  }

  return (
    <>
      <audio ref={audioRef} src="/fortune/crack-sound.mp3" preload="auto" />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-b from-amber-50 via-amber-100 to-amber-50">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto px-6">
          {/* Title with fade-in animation */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-black/90 mb-3 tracking-tight">
              Fortune Cookie
            </h1>
            <p className="text-lg text-black/60">Break one, see what's inside</p>
          </div>

          {/* Floating cookie icon animation */}
          <div className="mb-16 animate-float">
            <div className="text-8xl filter drop-shadow-lg">🥠</div>
          </div>

          {/* Main CTA button with pulse animation */}
          <button
            onClick={handleStartCookieFlow}
            className="group relative overflow-hidden px-12 py-5 bg-of-orange text-white rounded-full text-xl font-semibold transition-all active:scale-98 shadow-xl animate-pulse-subtle"
          >
            <span className="relative z-10">See your fortune</span>
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </button>

          {/* Subtle hint text */}
          <p className="mt-8 text-sm text-black/40 animate-fade-in-delay">
            Tap to reveal your daily fortune
          </p>

          {/* Pot link */}
          <a
            href="/pot"
            className="mt-4 text-sm text-black/50 underline hover:text-black/70 transition-colors"
          >
            View pot
          </a>
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
              onViewPot={() => (window.location.href = "/pot")}
              onBackHome={handleBackHome}
            />
          )}
        </>
      )}
    </>
  )
}
