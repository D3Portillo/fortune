"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "./lib/utils"

type Stage = "idle" | "breaking" | "broken" | "reveal" | "pot"

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle")
  const [idleFrame, setIdleFrame] = useState(0)
  const [crackFrame, setCrackFrame] = useState(0)
  const [cookieLayerVisible, setCookieLayerVisible] = useState(true)
  const [cookieLayerFading, setCookieLayerFading] = useState(false)
  const [revealVisible, setRevealVisible] = useState(false)
  const [potVisible, setPotVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mock data - will come from backend later
  const fortuneData = {
    message: "Your patience today will bring unexpected rewards tomorrow",
    tokensEarned: 3,
    hasDiscount: true,
    discountPercent: 20,
  }

  const potData = {
    currentAmount: 247.5,
    daysRemaining: 2,
    userTickets: 1,
    totalTickets: 834,
  }

  // Idle animation - slowly cycle through first few frames
  useEffect(() => {
    if (stage !== "idle") return

    const interval = setInterval(() => {
      setIdleFrame((prev) => (prev + 1) % 3)
    }, 300)

    return () => clearInterval(interval)
  }, [stage])

  // Breaking animation - crack overlay plays on top
  useEffect(() => {
    if (stage !== "breaking") return

    const interval = setInterval(() => {
      setCrackFrame((prev) => {
        const next = prev + 1
        if (next >= 10) {
          setStage("broken")
          return 9
        }
        return next
      })
    }, 80)

    return () => clearInterval(interval)
  }, [stage])

  // Transition from broken to reveal - start fade in while pieces are flying
  useEffect(() => {
    if (stage !== "broken") return
    const timer = setTimeout(() => setStage("reveal"), 100)
    return () => clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    if (stage === "idle" || stage === "breaking" || stage === "broken") {
      setCookieLayerVisible(true)
      setCookieLayerFading(false)
    } else if (stage === "reveal") {
      setCookieLayerVisible(true)
      setCookieLayerFading(true)
      hideTimer = setTimeout(() => setCookieLayerVisible(false), 400)
    } else {
      setCookieLayerVisible(false)
      setCookieLayerFading(false)
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [stage])

  useEffect(() => {
    let raf: number | null = null

    if (stage === "reveal") {
      raf = requestAnimationFrame(() => setRevealVisible(true))
    } else {
      setRevealVisible(false)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [stage])

  useEffect(() => {
    if (stage === "pot") {
      const raf = requestAnimationFrame(() => setPotVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setPotVisible(false)
  }, [stage])

  const handleTap = () => {
    if (stage === "idle") {
      setStage("breaking")
      setCrackFrame(0)
      audioRef.current?.play()
    }
  }

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-amber-50 overflow-hidden">
      <audio ref={audioRef} src="/fortune/crack-sound.mp3" preload="auto" />

      {/* Cookie Breaking Animation */}
      {cookieLayerVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          {/* Cookie pieces flying off */}
          {(stage === "broken" || stage === "reveal") && (
            <>
              {/* Left piece */}
              <div
                className={cn(
                  "absolute overflow-hidden transition-all ease-out",
                  stage === "reveal" ? "duration-700" : "duration-2000",
                )}
                style={{
                  width: "200px",
                  height: "400px",
                  transform:
                    stage === "reveal"
                      ? "translateX(max(-100vw, -800px)) rotate(-45deg)"
                      : "translateX(max(-60vw, -400px)) rotate(-25deg)",
                }}
              >
                <div
                  style={{
                    width: "400px",
                    height: "400px",
                    backgroundImage: "url(/fortune/cookie.png)",
                    backgroundPosition: "0 -3600px",
                    backgroundSize: "400px 4000px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: "400px",
                    height: "400px",
                    backgroundImage: "url(/fortune/crack.png)",
                    backgroundPosition: "0 -3600px",
                    backgroundSize: "400px 4000px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>

              {/* Right piece */}
              <div
                className={cn(
                  "absolute overflow-hidden transition-all ease-out",
                  stage === "reveal" ? "duration-700" : "duration-2000",
                )}
                style={{
                  width: "200px",
                  height: "400px",
                  transform:
                    stage === "reveal"
                      ? "translateX(min(100vw, 800px)) rotate(45deg)"
                      : "translateX(min(60vw, 400px)) rotate(25deg)",
                }}
              >
                <div
                  style={{
                    width: "400px",
                    height: "400px",
                    backgroundImage: "url(/fortune/cookie.png)",
                    backgroundPosition: "-200px -3600px",
                    backgroundSize: "400px 4000px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: "400px",
                    height: "400px",
                    backgroundImage: "url(/fortune/crack.png)",
                    backgroundPosition: "-200px -3600px",
                    backgroundSize: "400px 4000px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
              </div>
            </>
          )}

          {/* Main cookie */}
          {stage !== "broken" && stage !== "reveal" && (
            <button
              onClick={handleTap}
              className={cn(
                "relative cursor-pointer focus:outline-none transition-transform pointer-events-auto",
                "hover:scale-105 active:scale-95",
              )}
              style={{
                width: "400px",
                height: "400px",
                backgroundImage: "url(/fortune/cookie.png)",
                backgroundPosition: `0 -${stage === "breaking" ? crackFrame * 400 : idleFrame * 400}px`,
                backgroundSize: "400px 4000px",
                backgroundRepeat: "no-repeat",
                imageRendering: "crisp-edges",
              }}
              aria-label="Tap to break fortune cookie"
            >
              {/* Crack overlay during breaking */}
              {stage === "breaking" && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url(/fortune/crack.png)",
                    backgroundPosition: `0 -${crackFrame * 400}px`,
                    backgroundSize: "400px 4000px",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "crisp-edges",
                  }}
                />
              )}
            </button>
          )}
        </div>
      )}

      {/* Fortune Reveal Screen */}
      {stage === "reveal" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm transition-opacity duration-500">
          <div
            className={cn(
              "h-full flex flex-col pt-12 pb-4",
              "w-full max-w-md mx-auto px-8 flex flex-col transition-all duration-700 ease-out",
              revealVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10",
            )}
          >
            {/* Fortune Text */}
            <div className="text-center mb-16 relative">
              <span className="absolute -rotate-12 -left-4 -top-4 text-7xl text-of-orange/30 leading-none select-none">
                {'"'}
              </span>
              <p className="text-2xl text-black/80 leading-relaxed px-8 font-fortune">
                {fortuneData.message}
              </p>
              <span className="absolute rotate-12 -right-4 -bottom-8 text-7xl text-of-orange/30 leading-none select-none">
                {'"'}
              </span>
            </div>

            {/* Rewards */}
            <div className="w-full space-y-3 mb-16">
              {/* Free Ticket */}
              <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
                <span className="text-base text-black/80">
                  Entered into pot
                </span>
                <span className="text-lg font-medium text-of-orange">
                  +1 ticket
                </span>
              </div>

              {/* Tokens */}
              <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
                <span className="text-base text-black/80">Tokens earned</span>
                <span className="text-lg font-medium text-of-orange">
                  +{fortuneData.tokensEarned}
                </span>
              </div>

              {/* Discount (conditional) */}
              {fortuneData.hasDiscount && (
                <div className="flex items-center justify-between py-4 px-6 bg-of-orange/10 rounded-2xl border border-of-orange/20">
                  <span className="text-base text-black/80">Today only</span>
                  <span className="text-lg font-medium text-of-orange">
                    {fortuneData.discountPercent}% off extra ticket
                  </span>
                </div>
              )}
            </div>

            <div className="grow" />

            {/* Actions */}
            <div className="w-full space-y-3">
              <button
                onClick={() => setStage("pot")}
                className="w-full py-4 bg-black text-white rounded-full text-base font-medium transition-opacity hover:opacity-80 active:opacity-60"
              >
                View Pot
              </button>
              <button
                onClick={() => setStage("idle")}
                className="w-full py-4 text-black/50 text-base font-medium transition-opacity hover:opacity-80 active:opacity-60"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pot Details Screen */}
      {stage === "pot" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm transition-opacity duration-500">
          <div
            className={cn(
              "w-full max-w-md mx-auto px-6 flex flex-col transition-all duration-600 ease-out",
              potVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            {/* Pot Amount */}
            <div className="text-center mb-12">
              <p className="text-sm text-black/50 mb-2">Current Pot</p>
              <p className="text-5xl font-bold text-of-orange">
                ${potData.currentAmount.toFixed(2)}
              </p>
            </div>

            {/* Pot Info */}
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
                <span className="text-base text-black/80">Days remaining</span>
                <span className="text-lg font-medium text-black">
                  {potData.daysRemaining}
                </span>
              </div>

              <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
                <span className="text-base text-black/80">Your tickets</span>
                <span className="text-lg font-medium text-of-orange">
                  {potData.userTickets}
                </span>
              </div>

              <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
                <span className="text-base text-black/80">Total tickets</span>
                <span className="text-lg font-medium text-black/50">
                  {potData.totalTickets.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-black/50 text-center mb-8 px-4 leading-relaxed">
              Draw happens automatically in {potData.daysRemaining} days. No
              action needed. All participants have equal chance per ticket.
            </p>

            {/* Actions */}
            <div className="w-full space-y-3 mt-auto">
              {fortuneData.hasDiscount && (
                <button className="w-full py-4 bg-of-orange text-white rounded-full text-base font-medium transition-opacity hover:opacity-80 active:opacity-60">
                  Buy Extra Ticket ({fortuneData.discountPercent}% off)
                </button>
              )}
              <button
                onClick={() => setStage("idle")}
                className="w-full py-4 text-black/50 text-base font-medium transition-opacity hover:opacity-80 active:opacity-60"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
