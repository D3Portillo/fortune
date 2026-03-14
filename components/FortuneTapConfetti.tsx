"use client"

import { useEffect, useMemo, useReducer } from "react"

// Warm amber/gold palette — fortune-cookie crumbs and slips
const COLORS = [
  "#fcab40", // amber (of-orange)
  "#f5c518", // gold
  "#e8c4a0", // cream fortune slip
  "#d4881a", // dark amber
  "#f0e68c", // pale gold
  "#8B5E3C", // cookie brown
]

// Timing constants (ms)
const MAX_DURATION = 900 // longest transition duration a particle can have
const MAX_DELAY = 60 // longest per-particle stagger delay
const CLEAR_DELAY = MAX_DURATION + MAX_DELAY + 90 // 1050 ms — buffer after all transitions finish

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
  /** Transition duration (ms) */
  duration: number
  /** Transition delay (ms) */
  delay: number
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
  const count = 10 + Math.floor(Math.random() * 5) // 10-14 particles
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const dist = 60 + Math.random() * 60 // 60-120 px spread
    const isSlip = Math.random() > 0.4
    return {
      id: uid++,
      tx: Math.round(Math.cos(angle) * dist),
      ty: Math.round(Math.sin(angle) * dist - 20), // slight upward bias
      rot: Math.round((Math.random() - 0.5) * 360),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: isSlip ? 8 + Math.round(Math.random() * 10) : 5 + Math.round(Math.random() * 5),
      h: isSlip ? 4 + Math.round(Math.random() * 2) : 5 + Math.round(Math.random() * 5),
      duration: 500 + Math.round(Math.random() * (MAX_DURATION - 500)),
      delay: Math.round(Math.random() * MAX_DELAY),
      isSlip,
    }
  })
}

type State = { particles: Particle[]; settled: boolean }
type Action = { type: "burst" } | { type: "settle" } | { type: "clear" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "burst":
      return { particles: buildParticles(), settled: false }
    case "settle":
      return { ...state, settled: true }
    case "clear":
      return { particles: [], settled: false }
    default:
      return state
  }
}

export function FortuneTapConfetti({ trigger, origin }: FortuneTapConfettiProps) {
  const [{ particles, settled }, dispatch] = useReducer(reducer, {
    particles: [],
    settled: false,
  })

  // Evaluated once per mount; the preference doesn't change during a session.
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  )

  useEffect(() => {
    if (trigger === 0) return

    dispatch({ type: "burst" })

    // Two requestAnimationFrame calls ensure the initial (un-settled) state is
    // painted to the DOM before we trigger the CSS transitions.
    let raf2: number | undefined
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => dispatch({ type: "settle" }))
    })

    // Clear particles after the longest possible transition finishes.
    const clear = setTimeout(() => dispatch({ type: "clear" }), CLEAR_DELAY)

    return () => {
      cancelAnimationFrame(raf1)
      if (raf2 !== undefined) cancelAnimationFrame(raf2)
      clearTimeout(clear)
    }
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: origin.x,
            top: origin.y,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.isSlip ? "2px" : "50%",
            // Initial state: visible, centred on tap point, not yet moving
            opacity: settled ? 0 : 1,
            transform: settled
              ? reduced
                ? "translate(-50%, -50%)" // fade in place, no motion
                : `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) rotate(${p.rot}deg) scale(0.3)`
              : "translate(-50%, -50%)",
            transition: settled
              ? `opacity ${p.duration}ms ease-out ${p.delay}ms, transform ${p.duration}ms ease-out ${p.delay}ms`
              : "none",
          }}
        />
      ))}
    </div>
  )
}
