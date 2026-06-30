"use client"

import { motion } from "framer-motion"
import { Shield, Brain, Lock, Menu, X, Cross } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import type { AppView, DashboardTab } from "@/app/page"

interface LandingPageProps {
  onNavigate: (view: AppView) => void
  onGetStarted: (tab: DashboardTab) => void
  isAuthenticated: boolean
}

const trustIndicators = [
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Medical images and reports analysed by AI models served via HuggingFace.",
  },
  {
    icon: Lock,
    title: "IPFS Storage",
    description: "Documents are pinned to IPFS so the original is always retrievable.",
  },
  {
    icon: Shield,
    title: "Immutable Proof",
    description: "A cryptographic hash of every report is recorded on the blockchain.",
  },
]

export default function LandingPage({ onNavigate, onGetStarted, isAuthenticated }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const primaryCta = isAuthenticated ? "Open Dashboard" : "Get Started"

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-slate-800">MediChain</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 transition-colors">How it Works</a>
              <Button
                onClick={() => (isAuthenticated ? onGetStarted("new") : onNavigate("auth"))}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              >
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-slate-200"
            >
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 transition-colors">How it Works</a>
                <Button
                  onClick={() => (isAuthenticated ? onGetStarted("new") : onNavigate("auth"))}
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                >
                  {isAuthenticated ? "Dashboard" : "Login"}
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight text-balance"
          >
            Verifiable Medical Records on the Blockchain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Upload medical reports, get AI-assisted analysis, and anchor a tamper-proof hash on Ethereum.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => onGetStarted("new")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg shadow-sm"
            >
              {primaryCta}
            </Button>
            <Button
              onClick={() => onGetStarted("verify")}
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg bg-transparent"
            >
              Verify a Document
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white shadow-sm border-slate-200/50 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                    <indicator.icon className="w-6 h-6 text-teal-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{indicator.title}</h3>
                  <p className="text-slate-600 text-sm">{indicator.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">How it Works</h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload", text: "A doctor uploads a medical report or X-ray for a patient address." },
              { step: "2", title: "Analyse & Pin", text: "The file is analysed by AI and pinned to IPFS." },
              { step: "3", title: "Anchor", text: "Its hash is written on-chain, creating immutable proof." },
            ].map((item) => (
              <li key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm max-w-xs mx-auto">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
