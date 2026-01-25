"use client"

import { useState, useEffect } from "react"
import { PotDetails } from "@/components/PotDetails"

export default function PotPage() {
  const [isVisible, setIsVisible] = useState(false)

  // Mock data - will come from backend later
  const fortuneData = {
    hasDiscount: true,
    discountPercent: 20,
  }

  const potData = {
    currentAmount: 247.5,
    daysRemaining: 2,
    userTickets: 1,
    totalTickets: 834,
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-amber-50 overflow-hidden">
      <PotDetails
        potData={potData}
        hasDiscount={fortuneData.hasDiscount}
        discountPercent={fortuneData.discountPercent}
        isVisible={isVisible}
        onBackHome={() => (window.location.href = "/")}
      />
    </main>
  )
}
