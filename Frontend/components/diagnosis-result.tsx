"use client"

import { motion } from "framer-motion"
import { Cross, ArrowLeft, CheckCircle2, Copy, ExternalLink, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import type { AppView, SubmitResult } from "@/app/page"

interface DiagnosisResultProps {
  onNavigate: (view: AppView) => void
  result: SubmitResult | null
}

export default function DiagnosisResult({ onNavigate, result }: DiagnosisResultProps) {
  const [copied, setCopied] = useState(false)

  const txHash = result?.transactionHash ?? ""
  const isNormal = result?.mlPrediction === "Normal" || result?.mlPrediction === "Healthy"
  const confidencePct = result ? `${(result.mlConfidence * 100).toFixed(1)}%` : "N/A"

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">MediChain</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl hidden sm:flex bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Summary */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white rounded-2xl shadow-sm border-slate-200/50 h-full">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">IPFS CID</p>
                  <p className="font-mono text-sm text-slate-800 break-all">{result?.ipfsHash ?? "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">SHA-256 File Hash</p>
                  <p className="font-mono text-xs text-slate-800 break-all">{result?.contentHash ?? "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">ML Prediction</p>
                  <p className="text-lg font-semibold text-slate-800">{result?.mlPrediction ?? "—"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <Card
              className={`rounded-2xl shadow-sm border-0 overflow-hidden ${isNormal ? "bg-emerald-50" : "bg-amber-50"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isNormal ? "bg-emerald-100" : "bg-amber-100"
                      }`}
                    >
                      <CheckCircle2 className={`w-6 h-6 ${isNormal ? "text-emerald-600" : "text-amber-600"}`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${isNormal ? "text-emerald-800" : "text-amber-800"}`}>
                        {result?.mlPrediction ?? "Analyzing..."}
                      </h3>
                      <p className={`text-sm ${isNormal ? "text-emerald-600" : "text-amber-600"}`}>
                        Report successfully recorded on-chain
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-xl px-3 py-1 ${
                      isNormal
                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                        : "bg-amber-600 text-white hover:bg-amber-600"
                    }`}
                  >
                    AI Confidence: {confidencePct}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Proof */}
            <Card className="bg-slate-900 rounded-2xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Blockchain Proof</h3>
                    <p className="text-sm text-slate-400">Transaction recorded on-chain</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-300" viewBox="0 0 320 512" fill="currentColor">
                      <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <code className="text-emerald-400 font-mono text-sm truncate">
                    {txHash || "No transaction hash"}
                  </code>
                  {txHash && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-400 text-sm mt-2"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
