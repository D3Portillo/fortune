"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "./lib/utils"

export default function Home() {
  const [stage, setStage] = useState<"idle" | "breaking" | "broken">("idle")
  const [crackFrame, setCrackFrame] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  const handleTap = () => {
    if (stage === "idle") {
      setStage("breaking")
      setCrackFrame(0)
      audioRef.current?.play()
    }
  }

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-linear-to-br from-amber-50 to-orange-100 overflow-hidden">
      <audio ref={audioRef} src="/fortune/crack-sound.mp3" preload="auto" />

      {/* Fortune paper */}
      <div
        className={cn(
          "absolute transition-all duration-700",
          stage === "broken"
            ? "opacity-100 scale-100 z-20"
            : "opacity-50 scale-90 z-0",
        )}
      >
        <div className="relative">
          <img
            src="/fortune/paper.png"
            alt="Fortune paper"
            className="w-[330px] h-auto"
          />
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm font-serif text-gray-800">
            Your fortune awaits with wisdom beyond measure, patience brings
            great rewards
          </p>
        </div>
      </div>

      {/* Cookie pieces flying off */}
      {stage === "broken" && (
        <>
          {/* Left piece */}
          <div
            className="absolute z-10 transition-all duration-2000 ease-out overflow-hidden"
            style={{
              width: "200px",
              height: "400px",
              transform: "translateX(-60vw) rotate(-25deg)",
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
            className="absolute z-10 transition-all duration-20000 ease-out overflow-hidden"
            style={{
              width: "200px",
              height: "400px",
              transform: "translateX(60vw) rotate(25deg)",
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
      {stage !== "broken" && (
        <button
          onClick={handleTap}
          className={cn(
            "relative z-10 cursor-pointer focus:outline-none transition-transform",
            "hover:scale-105 active:scale-95",
          )}
          style={{
            width: "400px",
            height: "400px",
            backgroundImage: "url(/fortune/cookie.png)",
            backgroundPosition: `0 -${stage === "breaking" ? crackFrame * 400 : 0}px`,
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
    </main>
  )
}
