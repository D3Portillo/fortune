"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

// App-themed amber / gold palette — fortune-cookie crumbs and slips
const COLORS = [
  "#fcab40", // amber (of-orange)
  "#f5c518", // gold
  "#e8c4a0", // cream fortune slip
  "#d4881a", // dark amber
  "#f0e68c", // pale gold
  "#8B5E3C", // cookie brown
]

export interface FortuneTapConfettiProps {
  /** Increment to fire a new burst. */
  trigger: number
  /** Viewport coordinates of the tap (clientX / clientY). */
  origin: { x: number; y: number }
}

export function FortuneTapConfetti({ trigger, origin }: FortuneTapConfettiProps) {
  useEffect(() => {
    if (trigger === 0) return

    // canvas-confetti expects origin as a 0–1 fraction of the viewport
    const x = origin.x / window.innerWidth
    const y = origin.y / window.innerHeight

    const cookieShape = confetti.shapeFromText({ text: "🥠", scalar: 2 })

    // Burst 1: fortune cookie emoji
    confetti({
      particleCount: 12,
      spread: 120,
      origin: { x, y },
      shapes: [cookieShape],
      scalar: 2,
      colors: COLORS,
      gravity: 0.9,
      disableForReducedMotion: true,
    })

    // Burst 2: themed amber / gold squares
    confetti({
      particleCount: 35,
      spread: 100,
      origin: { x, y },
      shapes: ["square"],
      colors: COLORS,
      gravity: 1.1,
      disableForReducedMotion: true,
    })
  }, [trigger, origin])

  // canvas-confetti manages its own full-page canvas overlay — no DOM output needed
  return null
}
