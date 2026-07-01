"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Copy, ExternalLink, Download, Check, ShieldCheck } from "lucide-react"
import { useState } from "react"
import type { SubmitResult } from "@/lib/api"
import { BrandMark, Wordmark } from "@/components/brand"
import { cn } from "@/lib/utils"

interface DiagnosisResultProps {
  onBack: () => void
  result: SubmitResult | null
}

const EXPLORER_TX_BASE = process.env.NEXT_PUBLIC_EXPLORER_TX_URL || ""

export default function DiagnosisResult({ onBack, result }: DiagnosisResultProps) {
  const [copied, setCopied] = useState(false)

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-4 text-center">
        <p className="mb-4 text-ink-soft">No result to display.</p>
        <button onClick={onBack} className="rounded-lg bg-pine px-6 py-3 font-medium text-paper-2 hover:bg-pine-2 transition-colors">Back to Dashboard</button>
      </div>
    )
  }

  const txHash = result.transactionHash
  const isNormal = result.mlPrediction === "Normal" || result.mlPrediction === "Healthy"
  const confidencePct = `${(result.mlConfidence * 100).toFixed(1)}%`

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(txHash); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `medichain-record-${txHash.slice(0, 10)}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const rows: [string, string][] = [
    ["IPFS CID", result.ipfsHash],
    ["SHA-256 fingerprint", result.contentHash],
    ["Transaction hash", txHash],
  ]

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper-2/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <button onClick={onBack} className="flex items-center gap-2 text-ink-soft hover:text-pine transition-colors">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline eyebrow">Dashboard</span>
          </button>
          <Wordmark />
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg border border-line-2 bg-paper-2 px-3.5 py-2 text-sm text-ink hover:border-pine transition-colors">
            <Download className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-moss-tint">
            <ShieldCheck className="h-8 w-8 text-moss" aria-hidden="true" />
          </div>
          <p className="eyebrow text-gold-2">Certificate issued</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">Report recorded on-chain</h1>
          <p className="mt-2 text-ink-soft">An immutable proof of this document now exists on Ethereum.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* AI reading */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-line-2 bg-paper-2 p-7">
            <p className="eyebrow text-ink-faint">AI reading</p>
            <p className="mt-4 font-display text-3xl text-ink">{result.mlPrediction}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-ink-soft">Confidence</span>
              <span className={cn("rounded-full px-3 py-1 text-sm font-medium",
                isNormal ? "bg-moss-tint text-moss" : "bg-gold-tint text-gold-2")}>{confidencePct}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper">
              <div className={cn("h-full rounded-full", isNormal ? "bg-moss" : "bg-gold")} style={{ width: `${Math.max(result.mlConfidence * 100, 4)}%` }} />
            </div>
          </motion.div>

          {/* Certificate */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl border border-line-2 bg-pine p-7 text-paper-2">
            <div className="pointer-events-none absolute inset-0 opacity-50"
              style={{ background: "radial-gradient(90% 60% at 90% 0%, rgba(176,129,42,0.28), transparent 60%)" }} />
            <div className="relative flex items-center justify-between">
              <p className="eyebrow text-gold-tint/80">Blockchain proof</p>
              <BrandMark className="h-7 w-7" />
            </div>

            <dl className="relative mt-6 space-y-4">
              {rows.map(([k, v]) => (
                <div key={k} className="border-t border-paper-2/15 pt-4 first:border-0 first:pt-0">
                  <dt className="eyebrow text-paper-2/50">{k}</dt>
                  <dd className="mt-1.5 flex items-center gap-2">
                    <code className="font-mono text-sm text-gold-tint break-all">{v}</code>
                    {k === "Transaction hash" && (
                      <span className="flex flex-shrink-0 items-center gap-1.5">
                        <button onClick={handleCopy} aria-label="Copy transaction hash" className="text-paper-2/60 hover:text-paper-2 transition-colors">
                          {copied ? <Check className="h-4 w-4 text-moss" /> : <Copy className="h-4 w-4" />}
                        </button>
                        {EXPLORER_TX_BASE && (
                          <a href={`${EXPLORER_TX_BASE}${txHash}`} target="_blank" rel="noopener noreferrer" aria-label="View on block explorer" className="text-paper-2/60 hover:text-paper-2 transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="relative mt-6 flex items-center justify-between border-t border-paper-2/15 pt-5">
              <span className="font-mono text-[0.7rem] text-paper-2/50">Ethereum · chainId 31337</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/50">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-tint" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg bg-pine px-7 py-3 font-medium text-paper-2 hover:bg-pine-2 transition-colors">
            Record another
          </button>
        </div>
      </main>
    </div>
  )
}
