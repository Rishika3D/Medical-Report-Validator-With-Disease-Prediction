"use client"

import { motion } from "framer-motion"
import { Shield, Brain, Lock, Menu, X, Cross } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import type { AppView } from "@/app/page"

interface LandingPageProps {
  onNavigate: (view: AppView) => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const trustIndicators = [
    {
      icon: Brain,
      title: "AI Precision",
      description: "State-of-the-art neural networks trained on millions of medical records",
    },
    {
      icon: Lock,
      title: "E2E Encryption",
      description: "Your data is encrypted at rest and in transit with AES-256",
    },
    {
      icon: Shield,
      title: "Immutable Record",
      description: "Every diagnosis is permanently secured on the Ethereum blockchain",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar with glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">MediChain</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                Features
              </a>
              <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                How it Works
              </a>
              <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                Pricing
              </a>
              <Button
                onClick={() => onNavigate("auth")}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-6"
              >
                Login
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-slate-200"
            >
              <div className="flex flex-col gap-4">
                <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Features
                </a>
                <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                  How it Works
                </a>
                <a href="#" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Pricing
                </a>
                <Button
                  onClick={() => onNavigate("auth")}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl w-full"
                >
                  Login
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight text-balance"
          >
            Trustless AI Diagnostics on the Blockchain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Upload medical reports, get instant AI analysis, and secure the results forever on Ethereum.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => onNavigate("dashboard")}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-8 py-6 text-lg shadow-sm"
            >
              Analyze Report
            </Button>
            <Button
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50 rounded-2xl px-8 py-6 text-lg bg-transparent"
            >
              Verify Hash
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white rounded-2xl shadow-sm border-slate-200/50 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                    <indicator.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{indicator.title}</h3>
                  <p className="text-slate-600 text-sm">{indicator.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
