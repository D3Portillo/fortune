"use client"

import { useState } from "react"
import Dialog from "./Dialog"

export function ActionClaimWithModal() {
  const [showClaimDialog, setShowClaimDialog] = useState(false)

  const onConfirm = () => {
    // TODO: handle claim logic
    setShowClaimDialog(false)
  }

  return (
    <>
      <button
        onClick={() => setShowClaimDialog(true)}
        className="text-sm text-black/40 underline underline-offset-4 font-fortune transition-colors hover:text-black/70 active:opacity-50"
      >
        Claim now
      </button>

      <Dialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        title="Claim your fortune"
      >
        <p className="text-sm text-white/70">
          You&apos;re about to claim your next fortune cookie early. Are you
          sure you want to proceed?
        </p>
        <button
          onClick={onConfirm}
          className="mt-7 bg-white text-black px-5 py-2 rounded-xl font-bold hover:bg-white/90 transition w-full"
        >
          CONFIRM
        </button>
      </Dialog>
    </>
  )
}
