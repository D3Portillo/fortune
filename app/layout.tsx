import "./globals.css"
import type { Metadata } from "next"

import { Inter, Libre_Baskerville, Noto_Serif_SC } from "next/font/google"
import { Toaster } from "sonner"

import { AlertProvider } from "@/components/Alert"
import SafeInsetProvider from "@/components/SafeInsetProvider"
import ErudaProvider from "@/components/ErudaProdiver"
import WorldProvider from "./WorldProvider"

const nextFont = Inter({
  subsets: [],
  display: "fallback",
  adjustFontFallback: true,
  preload: true,
  weight: ["400", "700", "900"],
})

const fortune = Libre_Baskerville({
  subsets: [],
  display: "swap",
  weight: ["400"],
  variable: "--font-fortune",
})

const china = Noto_Serif_SC({
  subsets: [],
  display: "swap",
  weight: ["400"],
  variable: "--font-china",
})

export const metadata: Metadata = {
  title: "Fortune Mini App",
  description: "A WIP Mini App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${nextFont.className} ${fortune.variable} ${china.variable} font-sans antialiased`}
      >
        <Toaster
          swipeDirections={["left", "right", "bottom", "top"]}
          theme="light"
          toastOptions={{
            classNames: {
              toast: "rounded-full! py-3! pl-5!",
            },
          }}
          position="top-center"
        />
        <AlertProvider />

        <WorldProvider>
          <ErudaProvider>
            <SafeInsetProvider>{children}</SafeInsetProvider>
          </ErudaProvider>
        </WorldProvider>
      </body>
    </html>
  )
}
