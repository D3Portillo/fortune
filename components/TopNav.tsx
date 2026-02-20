"use client"

import asset_logo from "@/assets/logo.svg"
import Image from "next/image"

import { useWorldAuth } from "@radish-la/world-auth"
import { beautifyAddress } from "@/app/lib/utils"

import AddressBlock from "./AddressBlock"

export function TopNav() {
  const { address, signIn } = useWorldAuth()

  return (
    <nav className="w-full flex items-center justify-between p-6 pb-4">
      {/* Left: app name */}
      <figure className="w-20">
        <Image className="w-full" src={asset_logo} alt="" />
      </figure>

      <button className="flex gap-2 items-center">
        <h1 className="text-black text-sm font-semibold">
          {address ? beautifyAddress(address) : "Connect"}
        </h1>
        <div className="size-9.5 saturate-200 border-2 border-black overflow-hidden rounded-xl">
          <AddressBlock address={address} />
        </div>
      </button>
    </nav>
  )
}
