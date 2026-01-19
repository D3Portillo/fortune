import "./globals.css"
import type { Metadata, Viewport } from "next"

import { Inter, Libre_Baskerville } from "next/font/google"
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
  weight: ["400", "500", "700", "800"],
})

const fortune = Libre_Baskerville({
  subsets: [],
  display: "swap",
  weight: ["400"],
  variable: "--font-fortune",
})

export const metadata: Metadata = {
  title: "Fortune Mini App",
  description: "A WIP Mini App",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${nextFont.className} ${fortune.variable} font-sans antialiased`}
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
