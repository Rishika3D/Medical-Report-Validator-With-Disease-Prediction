"use client"

import { motion } from "framer-motion"
import { Cross, ArrowLeft, CheckCircle2, Copy, ExternalLink, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import type { SubmitResult } from "@/lib/api"

interface DiagnosisResultProps {
  onBack: () => void
  result: SubmitResult | null
}

// Optional block explorer base (e.g. https://sepolia.etherscan.io/tx/). Empty for local chains.
const EXPLORER_TX_BASE = process.env.NEXT_PUBLIC_EXPLORER_TX_URL || ""

export default function DiagnosisResult({ onBack, result }: DiagnosisResultProps) {
  const [copied, setCopied] = useState(false)

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-slate-600 mb-4">No result to display.</p>
        <Button onClick={onBack} className="bg-teal-600 hover:bg-teal-700 text-white">Back to Dashboard</Button>
      </div>
    )
  }

  const txHash = result.transactionHash
  const isNormal = result.mlPrediction === "Normal" || result.mlPrediction === "Healthy"
  const confidencePct = `${(result.mlConfidence * 100).toFixed(1)}%`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medichain-report-${txHash.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-slate-800">MediChain</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="bg-transparent">
              <Download className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white shadow-sm border-slate-200/50 h-full">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">IPFS CID</p>
                  <p className="font-mono text-sm text-slate-800 break-all">{result.ipfsHash}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">SHA-256 File Hash</p>
                  <p className="font-mono text-xs text-slate-800 break-all">{result.contentHash}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">AI Prediction</p>
                  <p className="text-lg font-semibold text-slate-800">{result.mlPrediction}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">
            <Card className={`shadow-sm border-0 overflow-hidden ${isNormal ? "bg-emerald-50" : "bg-amber-50"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isNormal ? "bg-emerald-100" : "bg-amber-100"}`}>
                      <CheckCircle2 className={`w-6 h-6 ${isNormal ? "text-emerald-600" : "text-amber-600"}`} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isNormal ? "text-emerald-800" : "text-amber-800"}`}>{result.mlPrediction}</h2>
                      <p className={`text-sm ${isNormal ? "text-emerald-600" : "text-amber-600"}`}>Report recorded on-chain</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 ${isNormal ? "bg-emerald-600" : "bg-amber-600"} text-white`}>
                    {confidencePct}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">Blockchain Proof</h3>
                  <p className="text-sm text-slate-400">Transaction hash recorded on-chain</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <code className="text-emerald-400 font-mono text-sm truncate">{txHash}</code>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleCopy} aria-label="Copy transaction hash" className="text-slate-400 hover:text-white transition-colors">
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {EXPLORER_TX_BASE && (
                      <a href={`${EXPLORER_TX_BASE}${txHash}`} target="_blank" rel="noopener noreferrer" aria-label="View on block explorer" className="text-slate-400 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                {copied && <p role="status" className="text-emerald-400 text-sm mt-2">Copied to clipboard</p>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
