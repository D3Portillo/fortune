"use client"

import { useState } from "react"
import asset_logo from "@/assets/logo.svg"
import Image from "next/image"

import { useWorldAuth } from "@radish-la/world-auth"
import { beautifyAddress } from "@/app/lib/utils"
import { isConnectedOrDevEnv } from "@/app/lib/env"
import { localizeNumber } from "@/app/lib/numbers"
import { useFortuneState } from "@/app/hooks/useFortuneState"

import AddressBlock from "./AddressBlock"
import GameDialog from "./GameDialog"

export function TopNav() {
  const { address, signIn, signOut } = useWorldAuth()
  const [fortuneState] = useFortuneState()
  const [menuOpen, setMenuOpen] = useState(false)

  const connected = isConnectedOrDevEnv(address)

  const handleButtonClick = () => {
    if (connected) {
      setMenuOpen(true)
    } else {
      signIn()
    }
  }

  return (
    <nav className="w-full flex items-center justify-between p-6 pb-4">
      {/* Left: app name */}
      <figure className="w-20">
        <Image className="w-full" src={asset_logo} alt="" />
      </figure>

      <button onClick={handleButtonClick} className="flex gap-3 items-center">
        <div className="text-black text-end">
          <h1 className="text-sm font-semibold">
            {address ? beautifyAddress(address, 4, "") : "Connect"}
          </h1>
          <div className="text-xs -mt-0.5">
            {address ? `${localizeNumber(fortuneState.totalCookiesEarned)} Cookies` : "0 Cookies"}
          </div>
        </div>
        <div className="size-9.5 overflow-hidden rounded-xl">
          <AddressBlock
            name={address?.replace("0x", "")}
            onRenderMouth={() => (
              <span
                style={{
                  fontSize: "26cqw",
                }}
              >
                W
              </span>
            )}
          />
        </div>
      </button>

      {connected && (
        <GameDialog
          open={menuOpen}
          onOpenChange={setMenuOpen}
          title="Your Portfolio"
          actions={[
            {
              label: "Disconnect",
              onClick: signOut,
              closeOnTap: true,
            },
          ]}
        >
          {/* Cookie balance */}
          <div className="flex items-center justify-between py-4 border-b border-black/8">
            <span className="text-sm text-black/50">Cookies Earned</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-4">
                {Array.from({
                  length: 3,
                }).map((_, i) => (
                  <img
                    key={`cookie-${i}`}
                    src="/chips.png"
                    alt="Cookie"
                    className="size-7 block"
                    style={{ zIndex: i }}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-black tabular-nums">
                {localizeNumber(fortuneState.totalCookiesEarned)}
              </span>
            </div>
          </div>
        </GameDialog>
      )}
    </nav>
  )
}
