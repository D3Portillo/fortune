"use client"

export function TopNav() {
  return (
    <nav className="w-full flex items-center justify-between px-6 pt-6 pb-2">
      {/* Left: app name */}
      <span className="font-fortune text-base text-black/40">Fortune</span>

      {/* Right: squircle avatar placeholder */}
      <div className="w-9 h-9 bg-black" style={{ borderRadius: "30%" }} />
    </nav>
  )
}
