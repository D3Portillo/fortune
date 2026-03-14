"use client"

import { type ReactNode } from "react"
import Dialog, { type DialogProps } from "./Dialog"

export type GameDialogAction = {
  label: string
  onClick: () => void
  closeOnTap?: boolean
}

export type GameDialogProps = Omit<DialogProps, "children"> & {
  children?: ReactNode
  actions?: GameDialogAction[]
}

export default function GameDialog({
  children,
  actions,
  onOpenChange,
  ...props
}: GameDialogProps) {
  const cappedActions = actions?.slice(0, 2) ?? []

  const handleAction = (action: GameDialogAction) => {
    action.onClick()
    if (action.closeOnTap) {
      onOpenChange?.(false)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      {children}
      {cappedActions.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {cappedActions.map((action, i) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className={
                i === 0
                  ? "w-full py-3.5 px-6 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/90 active:opacity-60 transition-colors"
                  : "w-full py-3.5 px-6 rounded-xl bg-black/8 text-black/70 text-sm font-semibold hover:bg-black/12 active:opacity-60 transition-colors"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </Dialog>
  )
}
