"use client"

import { useEffect, useRef } from "react"

// Fortune-themed colours: gold, red-gold, orange, cream
const COLORS = ["#FFD700", "#FF8C00", "#FFA500", "#FF6B35", "#E8C96E", "#FFEC8B"]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  w: number
  h: number
  rotation: number
  rotSpeed: number
  opacity: number
}

interface ConfettiProps {
  /** Increment this value to fire a new burst. */
  trigger: number
  /** Origin point in viewport coordinates. Defaults to horizontal center, 40% from top. */
  origin?: { x: number; y: number }
}

export function Confetti({ trigger, origin }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  // Keep a ref so the confetti effect always reads the latest origin without
  // needing it in the trigger-effect dependency array.
  const originRef = useRef(origin)
  useEffect(() => {
    originRef.current = origin
  })

  useEffect(() => {
    if (trigger === 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ox = originRef.current?.x ?? canvas.width / 2
    const oy = originRef.current?.y ?? canvas.height * 0.4

    const particles: Particle[] = Array.from({ length: 38 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: Math.random() * 8 + 4,
        h: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        opacity: 1,
      }
    })

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        if (p.opacity <= 0) continue
        alive = true

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.22 // gravity
        p.rotation += p.rotSpeed
        p.opacity -= 0.014

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [trigger])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
  )
}
