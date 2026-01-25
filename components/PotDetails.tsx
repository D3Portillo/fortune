import { cn } from "@/app/lib/utils"

type PotData = {
  currentAmount: number
  daysRemaining: number
  userTickets: number
  totalTickets: number
}

type PotDetailsProps = {
  potData: PotData
  hasDiscount: boolean
  discountPercent: number
  isVisible: boolean
  onBackHome: () => void
}

export function PotDetails({
  potData,
  hasDiscount,
  discountPercent,
  isVisible,
  onBackHome,
}: PotDetailsProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-amber-50/95 backdrop-blur-sm transition-opacity duration-500">
      <div
        className={cn(
          "w-full max-w-md mx-auto px-6 flex flex-col transition-all duration-600 ease-out",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8",
        )}
      >
        {/* Pot Amount */}
        <div className="text-center mb-12">
          <p className="text-sm text-black/50 mb-2">Current Pot</p>
          <p className="text-5xl font-bold text-of-orange">
            ${potData.currentAmount.toFixed(2)}
          </p>
        </div>

        {/* Pot Info */}
        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
            <span className="text-base text-black/80">Days remaining</span>
            <span className="text-lg font-medium text-black">
              {potData.daysRemaining}
            </span>
          </div>

          <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
            <span className="text-base text-black/80">Your tickets</span>
            <span className="text-lg font-medium text-of-orange">
              {potData.userTickets}
            </span>
          </div>

          <div className="flex items-center justify-between py-4 px-6 bg-white/50 rounded-2xl border border-black/5">
            <span className="text-base text-black/80">Total tickets</span>
            <span className="text-lg font-medium text-black/50">
              {potData.totalTickets.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-black/50 text-center mb-8 px-4 leading-relaxed">
          Draw happens automatically in {potData.daysRemaining} days. No
          action needed. All participants have equal chance per ticket.
        </p>

        {/* Actions */}
        <div className="w-full space-y-3 mt-auto">
          {hasDiscount && (
            <button className="w-full py-4 bg-of-orange text-white rounded-full text-base font-medium transition-opacity hover:opacity-80 active:opacity-60">
              Buy Extra Ticket ({discountPercent}% off)
            </button>
          )}
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
