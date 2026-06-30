"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Cross, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import type { AppView } from "@/app/page"
import { api, ApiError, type UserRole } from "@/lib/api"
import type { Session } from "@/lib/auth"

interface AuthPageProps {
  onNavigate: (view: AppView) => void
  onAuthSuccess: (session: Session) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthPage({ onNavigate, onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<UserRole>("patient")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (): string | null => {
    if (userName.trim().length < 3) return "Username must be at least 3 characters."
    if (!isLogin && email && !EMAIL_RE.test(email)) return "Please enter a valid email address."
    if (password.length < 8) return "Password must be at least 8 characters."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const res = isLogin
        ? await api.login({ userName: userName.trim(), password })
        : await api.signup({ userName: userName.trim(), email: email.trim() || undefined, password, role })
      onAuthSuccess({ token: res.token, user: res.user })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/blurred-medical-hospital-background-abstract.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <button
        onClick={() => onNavigate("landing")}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-2 py-1"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        <span>Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <Cross className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-slate-800">MediChain</span>
            </div>
            <h1 className="text-slate-600 text-sm">
              {isLogin ? "Welcome back! Please sign in." : "Create your account to get started."}
            </h1>
          </CardHeader>
          <CardContent className="pt-4">
            {!isLogin && (
              <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                  <TabsTrigger value="patient" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                    Patient
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                    Doctor
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-slate-700">Username</Label>
                <Input
                  id="userName"
                  autoComplete="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="your_username"
                  required
                  aria-invalid={!!error}
                  className="border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email <span className="text-slate-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  aria-invalid={!!error}
                  className="border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Please wait…
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                }}
                className="text-teal-600 hover:text-teal-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
