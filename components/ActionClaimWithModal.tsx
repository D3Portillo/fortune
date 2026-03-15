"use client"

import { Fragment, useState } from "react"
import GameDialog from "./GameDialog"
import { executeWorldPayment } from "@/app/actions/executeWorldPayment"
import { toast } from "sonner"

export function ActionClaimWithModal() {
  const [showClaimDialog, setShowClaimDialog] = useState(false)

  async function handleClaim() {
    const txId = await executeWorldPayment({
      paymentDescription: "Early Fortune Claim",
      amount: 5,
      token: "WLD",
    })

    if (txId) {
      toast.success("Your fortune is awaiting")
      // TODO: Set wait timer back to ZERO and trigger cookie break animation immediately
    }
  }

  return (
    <Fragment>
      <button
        onClick={() => setShowClaimDialog(true)}
        className="text-sm text-black/40 underline underline-offset-4 font-fortune transition-colors hover:text-black/70 active:opacity-50"
      >
        Claim now
      </button>

      <GameDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        title="Claim your fortune"
        actions={[
          {
            label: "CONFIRM (5 WLD)",
            onClick: handleClaim,
            closeOnTap: true,
          },
        ]}
      >
        <p className="text-sm text-black/60">
          You're about to claim your next fortune cookie early. Are you sure you
          want to proceed?
        </p>
      </GameDialog>
    </Fragment>
  )
}
