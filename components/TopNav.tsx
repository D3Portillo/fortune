"use client"

import { useState } from "react"
import asset_logo from "@/assets/logo.svg"
import Image from "next/image"
import { useAtom } from "jotai"

import { useWorldAuth } from "@radish-la/world-auth"
import { beautifyAddress } from "@/app/lib/utils"
import { isConnectedOrDevEnv } from "@/app/lib/env"
import { dailyFortuneAtom } from "@/app/atoms/fortune"

import AddressBlock from "./AddressBlock"
import Dialog from "./Dialog"

const MAX_DISPLAYED_CHIPS = 5

export function TopNav() {
  const { address, signIn, signOut } = useWorldAuth()
  const [fortuneState] = useAtom(dailyFortuneAtom)
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
        <h1 className="text-black text-sm font-semibold">
          {address ? beautifyAddress(address, 4, "") : "Connect"}
        </h1>
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
        <Dialog
          open={menuOpen}
          onOpenChange={setMenuOpen}
          title="My Cookies"
        >
          {/* Cookie balance */}
          <div className="flex items-center justify-between py-4 px-1 border-b border-white/10">
            <span className="text-sm text-white/50 uppercase tracking-widest">
              Balance
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {Array.from({
                  length: Math.min(fortuneState.chipsEarned, MAX_DISPLAYED_CHIPS),
                }).map((_, i) => (
                  <img
                    key={`chip-${i}`}
                    src="/chips.png"
                    alt="Cookie chip"
                    className="size-7 block"
                    style={{ zIndex: i }}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white tabular-nums">
                ×{fortuneState.chipsEarned}
              </span>
            </div>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => {
              signOut()
              setMenuOpen(false)
            }}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-white/8 text-white/50 text-sm font-semibold hover:bg-white/12 hover:text-white/70 active:opacity-60 transition-colors"
          >
            Disconnect
          </button>
        </Dialog>
      )}
    </nav>
  )
}
