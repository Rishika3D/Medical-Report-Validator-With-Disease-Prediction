"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import AuthPage from "@/components/auth-page"
import Dashboard from "@/components/dashboard"
import DiagnosisResult from "@/components/diagnosis-result"

export type AppView = "landing" | "auth" | "dashboard" | "result"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [userType, setUserType] = useState<"doctor" | "patient">("patient")

  return (
    <main className="min-h-screen bg-slate-50">
      {currentView === "landing" && <LandingPage onNavigate={setCurrentView} />}
      {currentView === "auth" && <AuthPage onNavigate={setCurrentView} userType={userType} setUserType={setUserType} />}
      {currentView === "dashboard" && <Dashboard onNavigate={setCurrentView} userType={userType} />}
      {currentView === "result" && <DiagnosisResult onNavigate={setCurrentView} />}
    </main>
  )
}
