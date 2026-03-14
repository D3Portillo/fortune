"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

const COLORS = [
  "#fcab40",
  "#f5c518",
  "#e8c4a0",
  "#d4881a",
  "#f0e68c",
  "#8B5E3C",
]

export function FortuneTapConfetti() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      const cookieShape = confetti.shapeFromText({ text: "🥠", scalar: 2 })
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
      confetti({
        particleCount: 35,
        spread: 100,
        origin: { x, y },
        shapes: ["square"],
        colors: COLORS,
        gravity: 1.1,
        disableForReducedMotion: true,
      })
    }
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [])

  return null
}
