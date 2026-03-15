"use client"

import { useState } from "react"
import GameDialog from "./GameDialog"

export function ActionClaimWithModal() {
  const [showClaimDialog, setShowClaimDialog] = useState(false)

  return (
    <>
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
            onClick: () => {
              // TODO: handle claim logic
            },
            closeOnTap: true,
          },
        ]}
      >
        <p className="text-sm text-black/60">
          You&apos;re about to claim your next fortune cookie early. Are you
          sure you want to proceed?
        </p>
      </GameDialog>
    </>
  )
}
