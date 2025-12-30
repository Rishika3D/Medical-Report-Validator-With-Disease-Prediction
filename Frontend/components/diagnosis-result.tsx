"use client"

import { motion } from "framer-motion"
import { Cross, ArrowLeft, CheckCircle2, AlertTriangle, Copy, ExternalLink, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import type { AppView } from "@/app/page"

interface DiagnosisResultProps {
  onNavigate: (view: AppView) => void
}

export default function DiagnosisResult({ onNavigate }: DiagnosisResultProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Simulating the 2-second AI processing delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const isNormal = true // Toggle for demo purposes
  const txHash = "0x3f8a7b2c9d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5"

  const vitals = [
    { label: "Hemoglobin", value: "12.5 g/dL", status: "normal" },
    { label: "White Blood Cells", value: "7,200 /μL", status: "normal" },
    { label: "Platelets", value: "245,000 /μL", status: "normal" },
    { label: "Glucose (Fasting)", value: "95 mg/dL", status: "normal" },
    { label: "Creatinine", value: "0.9 mg/dL", status: "normal" },
    { label: "Cholesterol (Total)", value: "185 mg/dL", status: "normal" },
  ]

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

      {/* Main Content - Split Screen */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Document Viewer */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white rounded-2xl shadow-sm border-slate-200/50 h-full">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Document Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-[500px] skeleton-shimmer" />
                ) : (
                  <div className="h-[500px] bg-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <img
                        src="/medical-lab-report-document.jpg"
                        alt="Medical Report Preview"
                        className="mx-auto mb-4 rounded-lg"
                      />
                    </div>
                  </div>
                )}
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
            {isLoading ? (
              <Card className="rounded-2xl shadow-sm border-slate-200/50 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 w-32 skeleton-shimmer rounded" />
                      <div className="h-4 w-48 skeleton-shimmer rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`rounded-2xl shadow-sm border-0 overflow-hidden ${isNormal ? "bg-emerald-50" : "bg-red-50"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isNormal ? "bg-emerald-100" : "bg-red-100"
                        }`}
                      >
                        {isNormal ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isNormal ? "text-emerald-800" : "text-red-800"}`}>
                          {isNormal ? "Normal Results" : "Anomaly Detected"}
                        </h3>
                        <p className={`text-sm ${isNormal ? "text-emerald-600" : "text-red-600"}`}>
                          All values within healthy range
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`rounded-xl px-3 py-1 ${
                        isNormal
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : "bg-red-600 text-white hover:bg-red-600"
                      }`}
                    >
                      AI Confidence: 98.5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vitals Grid */}
            <Card className="bg-white rounded-2xl shadow-sm border-slate-200/50">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg text-slate-800">Extracted Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl">
                        <div className="h-4 w-20 skeleton-shimmer rounded mb-2" />
                        <div className="h-6 w-24 skeleton-shimmer rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {vitals.map((vital) => (
                      <div key={vital.label} className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-500 mb-1">{vital.label}</p>
                        <p className="text-lg font-semibold text-slate-800">{vital.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blockchain Proof */}
            <Card className="bg-slate-900 rounded-2xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-5 w-32 bg-slate-700 rounded" />
                    <div className="h-4 w-48 bg-slate-700 rounded" />
                    <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Blockchain Proof</h3>
                        <p className="text-sm text-slate-400">Secured on Ethereum Mainnet</p>
                      </div>
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-300" viewBox="0 0 320 512" fill="currentColor">
                          <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                      <code className="text-emerald-400 font-mono text-sm truncate">{txHash}</code>
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
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
