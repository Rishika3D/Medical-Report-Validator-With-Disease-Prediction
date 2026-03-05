"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import AuthPage from "@/components/auth-page"
import Dashboard from "@/components/dashboard"
import DiagnosisResult from "@/components/diagnosis-result"

export type AppView = "landing" | "auth" | "dashboard" | "result"

export type SubmitResult = {
  transactionHash: string
  ipfsHash: string
  contentHash: string
  mlPrediction: string
  mlConfidence: number
}

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [userType, setUserType] = useState<"doctor" | "patient">("patient")
  const [token, setToken] = useState<string | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken)
    setCurrentView("dashboard")
  }

  const handleUploadSuccess = (result: SubmitResult) => {
    setSubmitResult(result)
    setCurrentView("result")
  }

  const handleLogout = () => {
    setToken(null)
    setSubmitResult(null)
    setCurrentView("landing")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {currentView === "landing" && <LandingPage onNavigate={setCurrentView} />}
      {currentView === "auth" && (
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onNavigate={setCurrentView}
          userType={userType}
          setUserType={setUserType}
        />
      )}
      {currentView === "dashboard" && token && (
        <Dashboard
          onNavigate={setCurrentView}
          onUploadSuccess={handleUploadSuccess}
          onLogout={handleLogout}
          userType={userType}
          token={token}
        />
      )}
      {currentView === "result" && (
        <DiagnosisResult onNavigate={setCurrentView} result={submitResult} />
      )}
    </main>
  )
}
