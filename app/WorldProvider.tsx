"use client"

import { type PropsWithChildren } from "react"
import { WorldAppProvider } from "@radish-la/world-auth"
import { validator } from "@/app/actions/validator"

export default function Provider({ children }: PropsWithChildren) {
  return (
    <WorldAppProvider appName="WIP_MINI_APP" withValidator={validator}>
      {children}
    </WorldAppProvider>
  )
}
