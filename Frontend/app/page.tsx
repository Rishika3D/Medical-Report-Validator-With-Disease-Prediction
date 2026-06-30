"use client"

import { useEffect, useState } from "react"
import LandingPage from "@/components/landing-page"
import AuthPage from "@/components/auth-page"
import Dashboard from "@/components/dashboard"
import DiagnosisResult from "@/components/diagnosis-result"
import { Spinner } from "@/components/ui/spinner"
import type { SubmitResult } from "@/lib/api"
import { loadSession, saveSession, clearSession, isTokenExpired, type Session } from "@/lib/auth"

export type AppView = "landing" | "auth" | "dashboard" | "result"
export type DashboardTab = "new" | "verify" | "history" | "settings"
export type { SubmitResult }

export default function Home() {
  const [hydrated, setHydrated] = useState(false)
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("new")
  const [session, setSession] = useState<Session | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)

  // Restore persisted session on first load.
  useEffect(() => {
    const stored = loadSession()
    if (stored && !isTokenExpired(stored.token)) {
      setSession(stored)
      setCurrentView("dashboard")
    } else if (stored) {
      clearSession()
    }
    setHydrated(true)
  }, [])

  const handleAuthSuccess = (newSession: Session) => {
    saveSession(newSession)
    setSession(newSession)
    setCurrentView("dashboard")
    setDashboardTab("new")
  }

  const handleUploadSuccess = (result: SubmitResult) => {
    setSubmitResult(result)
    setCurrentView("result")
  }

  const handleLogout = () => {
    clearSession()
    setSession(null)
    setSubmitResult(null)
    setCurrentView("landing")
  }

  const goToDashboard = (tab: DashboardTab) => {
    if (session) {
      setDashboardTab(tab)
      setCurrentView("dashboard")
    } else {
      setCurrentView("auth")
    }
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
        <span className="sr-only">Loading</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {currentView === "landing" && (
        <LandingPage onNavigate={setCurrentView} onGetStarted={goToDashboard} isAuthenticated={!!session} />
      )}

      {currentView === "auth" && (
        <AuthPage onAuthSuccess={handleAuthSuccess} onNavigate={setCurrentView} />
      )}

      {currentView === "dashboard" && session && (
        <Dashboard
          activeTab={dashboardTab}
          onTabChange={setDashboardTab}
          onUploadSuccess={handleUploadSuccess}
          onLogout={handleLogout}
          user={session.user}
          token={session.token}
        />
      )}

      {/* Guard: never render the dashboard without a session */}
      {currentView === "dashboard" && !session && (
        <AuthPage onAuthSuccess={handleAuthSuccess} onNavigate={setCurrentView} />
      )}

      {currentView === "result" && (
        <DiagnosisResult onBack={() => setCurrentView("dashboard")} result={submitResult} />
      )}
    </main>
  )
}
