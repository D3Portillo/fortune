import { cn } from "@/app/lib/utils"

type FortuneData = {
  message: string
  tokensEarned: number
  hasDiscount: boolean
  discountPercent: number
}

type FortuneRevealProps = {
  fortuneData: FortuneData
  isVisible: boolean
  onViewPot: () => void
  onBackHome: () => void
}

export function FortuneReveal({
  fortuneData,
  isVisible,
  onViewPot,
  onBackHome,
}: FortuneRevealProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm transition-opacity duration-500">
      <div
        className={cn(
          "h-full flex flex-col pt-12 pb-4",
          "w-full max-w-md mx-auto px-8 flex flex-col transition-all duration-700 ease-out",
          isVisible
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
            onClick={onViewPot}
            className="w-full py-4 bg-black text-white rounded-full text-base font-medium transition-opacity hover:opacity-80 active:opacity-60"
          >
            View Pot
          </button>
          <button
            onClick={onBackHome}
            className="w-full py-4 text-black/50 text-base font-medium transition-opacity hover:opacity-80 active:opacity-60"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
