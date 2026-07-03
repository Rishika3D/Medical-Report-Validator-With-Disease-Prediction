import type React from "react"
import type { Metadata, Viewport } from "next"
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
})

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["300", "400", "500", "600", "700"],
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "MediChain — Verifiable Medical Records on the Blockchain",
  description:
    "Record medical reports with AI analysis, pin them to IPFS, and anchor a tamper-proof proof on Ethereum.",
  generator: "Next.js",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#103b2c",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased grain">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
