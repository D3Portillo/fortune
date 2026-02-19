"use client"

import asset_logo from "@/assets/logo.svg"
import Image from "next/image"

export function TopNav() {
  return (
    <nav className="w-full flex items-center justify-between px-6 pt-6 pb-2">
      {/* Left: app name */}
      <figure className="w-20">
        <Image className="w-full" src={asset_logo} alt="" />
      </figure>

      {/* Right: squircle avatar placeholder */}
      <div className="w-9 h-9 bg-black" style={{ borderRadius: "30%" }} />
    </nav>
  )
}
