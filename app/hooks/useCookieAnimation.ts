import { useState, useEffect, useRef } from "react"

type Stage = "idle" | "breaking" | "broken" | "reveal"

export function useCookieAnimation(stage: Stage) {
  const [idleFrame, setIdleFrame] = useState(0)
  const [crackFrame, setCrackFrame] = useState(0)
  const [cookieLayerVisible, setCookieLayerVisible] = useState(true)
  const [revealVisible, setRevealVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Idle animation loop
  useEffect(() => {
    if (stage !== "idle") return

    const interval = setInterval(() => {
      setIdleFrame((prev) => (prev + 1) % 3)
    }, 300)

    return () => clearInterval(interval)
  }, [stage])

  // Breaking animation
  useEffect(() => {
    if (stage !== "breaking") return

    const interval = setInterval(() => {
      setCrackFrame((prev) => {
        const next = prev + 1
        if (next >= 10) {
          return 9
        }
        return next
      })
    }, 80)

    return () => clearInterval(interval)
  }, [stage])

  // Cookie layer visibility management
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    if (stage === "idle" || stage === "breaking" || stage === "broken") {
      setCookieLayerVisible(true)
    } else if (stage === "reveal") {
      setCookieLayerVisible(true)
      hideTimer = setTimeout(() => setCookieLayerVisible(false), 400)
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [stage])

  // Reveal screen fade-in
  useEffect(() => {
    if (stage === "reveal") {
      const raf = requestAnimationFrame(() => setRevealVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setRevealVisible(false)
  }, [stage])

  return {
    idleFrame,
    crackFrame,
    cookieLayerVisible,
    revealVisible,
    audioRef,
    resetCrackFrame: () => setCrackFrame(0),
  }
}
