"use client"

import { cn, toChinaNumeral } from "@/app/lib/utils"

type FortuneData = {
  message: string
  chipsEarned: number
  luckyNumber: number
}

type FortuneRevealProps = {
  fortuneData: FortuneData
  isVisible: boolean
  onBackHome: () => void
}

export function FortuneReveal({
  fortuneData,
  isVisible,
  onBackHome,
}: FortuneRevealProps) {
  const chineseNumeral = toChinaNumeral(fortuneData.luckyNumber)

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm">
      <div
        className={cn(
          "h-full w-full max-w-md mx-auto px-8 flex flex-col pt-16 pb-10 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
      >
        <div className="grow" />

        {/* Fortune message */}
        <div className="relative text-center mb-14">
          <span className="absolute -rotate-12 -left-2 -top-3 text-6xl text-of-orange/20 leading-none select-none">
            &ldquo;
          </span>
          <p className="text-2xl text-black/80 leading-relaxed px-6 font-fortune">
            {fortuneData.message}
          </p>
          <span className="absolute rotate-12 -right-2 -bottom-6 text-6xl text-of-orange/20 leading-none select-none">
            &rdquo;
          </span>
        </div>

        {/* Lucky number */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-xs tracking-widest uppercase text-black/30 mb-4">
            Lucky Number
          </p>
          <div className="relative flex items-baseline gap-1">
            {/* Radial glow */}
            <div
              className="absolute blur-xl size-60 left-1/2 -top-16 -translate-x-1/2 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,170,70,0.15) 0%, transparent 40%)",
              }}
            />
            <span className="relative font-china text-8xl text-black/85 leading-none">
              {chineseNumeral}
            </span>
            <span className="relative text-3xl text-black/25 font-light tabular-nums">
              {fortuneData.luckyNumber}
            </span>
          </div>
        </div>

        <div className="grow" />

        {/* Chips earned */}
        <div className="flex items-center justify-between py-4 px-6 bg-white/60 rounded-2xl border border-of-orange/40">
          <span className="text-sm text-black/60">Chips earned</span>
          <div className="flex items-center gap-2">
            {/* Stacked cookie sprites */}
            <div className="flex items-center -space-x-2">
              {Array.from({ length: fortuneData.chipsEarned }).map((_, i) => (
                <img
                  key={`chip-${i}`}
                  src="/chips.png"
                  alt=""
                  className="size-7 block"
                  style={{ zIndex: i }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-black tabular-nums">
              ×{fortuneData.chipsEarned}
            </span>
          </div>
        </div>

        {/* Return */}
        <button
          onClick={onBackHome}
          className="group bg-black rounded-2xl mt-4 w-full py-4 px-6 text-center font-fortune text-base text-white flex items-center justify-center gap-2"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          <span>Back to home</span>
        </button>
      </div>
    </div>
  )
}
