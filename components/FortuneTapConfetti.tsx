"use client"

import { useEffect, useRef, useReducer } from "react"

// Warm amber/gold palette — fortune-cookie crumbs and slips
const COLORS = [
  "#fcab40", // amber (of-orange)
  "#f5c518", // gold
  "#e8c4a0", // cream fortune slip
  "#d4881a", // dark amber
  "#f0e68c", // pale gold
  "#8B5E3C", // cookie brown
]

interface Particle {
  id: number
  /** Final x offset from origin (px) */
  tx: number
  /** Final y offset from origin (px) */
  ty: number
  /** Final rotation (deg) */
  rot: number
  color: string
  w: number
  h: number
  /** Animation delay (ms) */
  delay: number
  /** Animation duration (ms) */
  duration: number
  /** true = fortune slip (rect), false = cookie crumb (circle) */
  isSlip: boolean
}

export interface FortuneTapConfettiProps {
  /** Increment to fire a new burst. */
  trigger: number
  /** Tap coordinates relative to the containing element. */
  origin: { x: number; y: number }
}

let uid = 0

function buildParticles(): Particle[] {
  const count = 8 + Math.floor(Math.random() * 7) // 8-14 particles
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const dist = 50 + Math.random() * 50 // 50-100 px spread
    const isSlip = Math.random() > 0.45
    return {
      id: uid++,
      tx: Math.round(Math.cos(angle) * dist),
      ty: Math.round(Math.sin(angle) * dist - 18), // slight upward bias
      rot: Math.round((Math.random() - 0.5) * 300),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: isSlip ? 7 + Math.round(Math.random() * 9) : 4 + Math.round(Math.random() * 4),
      h: isSlip ? 3 + Math.round(Math.random() * 2) : 4 + Math.round(Math.random() * 3),
      delay: Math.round(Math.random() * 80),
      duration: 500 + Math.round(Math.random() * 400),
      isSlip,
    }
  })
}

type Action = { type: "burst" } | { type: "clear" }

function reducer(_: Particle[], action: Action): Particle[] {
  if (action.type === "burst") return buildParticles()
  return []
}

export function FortuneTapConfetti({ trigger, origin }: FortuneTapConfettiProps) {
  const [particles, dispatch] = useReducer(reducer, [])
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (trigger === 0) return

    dispatch({ type: "burst" })

    if (clearRef.current) clearTimeout(clearRef.current)
    // clear after longest possible animation (80 ms delay + 900 ms duration = 980 ms) with a small buffer
    clearRef.current = setTimeout(() => dispatch({ type: "clear" }), 1000)

    return () => {
      if (clearRef.current) clearTimeout(clearRef.current)
    }
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={
            {
              position: "absolute",
              left: origin.x,
              top: origin.y,
              width: p.w,
              height: p.h,
              backgroundColor: p.color,
              borderRadius: p.isSlip ? "1px" : "50%",
              "--p-tx": `${p.tx}px`,
              "--p-ty": `${p.ty}px`,
              "--p-rot": `${p.rot}deg`,
              animationName: "fortune-particle",
              animationDuration: `${p.duration}ms`,
              animationDelay: `${p.delay}ms`,
              animationTimingFunction: "ease-out",
              animationFillMode: "both",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
