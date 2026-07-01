"use client"

import type React from "react"
import { ArrowLeft, Loader2, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { AppView } from "@/app/page"
import { api, ApiError, type UserRole } from "@/lib/api"
import type { Session } from "@/lib/auth"
import { BrandMark, Wordmark } from "@/components/brand"
import { cn } from "@/lib/utils"

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
    const v = validate()
    if (v) return setError(v)
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

  const inputCls =
    "border-line-2 bg-paper/60 focus-visible:border-pine focus-visible:ring-pine/30 h-11"

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left editorial panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-pine p-12 text-paper-2">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(100% 60% at 80% 0%, rgba(176,129,42,0.22), transparent 60%)" }}
        />
        <div className="relative flex items-center gap-2.5">
          <BrandMark className="w-9 h-9" />
          <span className="font-display text-xl text-paper-2">MediChain</span>
        </div>

        <div className="relative">
          <p className="eyebrow text-gold-tint/80 mb-6">A verifiable ledger for care</p>
          <h2 className="font-display text-4xl xl:text-5xl leading-[1.05] tracking-tight text-paper-2">
            Every report,<br />
            <span className="italic text-gold-tint">provably</span> untouched.
          </h2>
          <p className="mt-6 max-w-sm text-paper-2/70 leading-relaxed">
            Hashes on Ethereum, files on IPFS, analysis by AI — an audit trail that
            no single party can quietly rewrite.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-paper-2/50">
          <span className="eyebrow">Ethereum</span>
          <span className="h-3 w-px bg-paper-2/20" />
          <span className="eyebrow">IPFS</span>
          <span className="h-3 w-px bg-paper-2/20" />
          <span className="eyebrow">SHA-256</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="relative flex flex-col justify-center px-6 py-12 sm:px-12">
        <button
          onClick={() => onNavigate("landing")}
          className="absolute top-6 left-6 sm:left-12 flex items-center gap-2 eyebrow text-ink-soft hover:text-pine transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>

        <div className="mx-auto w-full max-w-sm fade-up">
          <div className="lg:hidden mb-8">
            <Wordmark />
          </div>

          <h1 className="font-display text-3xl text-ink tracking-tight">
            {isLogin ? "Welcome back." : "Create your account."}
          </h1>
          <p className="mt-2 text-ink-soft">
            {isLogin ? "Sign in to continue to your dashboard." : "Join to record and verify medical documents."}
          </p>

          {!isLogin && (
            <div className="mt-7">
              <span className="eyebrow text-ink-faint">I am a</span>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-line bg-paper/60 p-1">
                {(["patient", "doctor"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={cn(
                      "rounded-md py-2 text-sm font-medium capitalize transition-colors",
                      role === r ? "bg-pine text-paper-2 shadow-sm" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="userName" className="text-ink-soft">Username</Label>
              <Input id="userName" autoComplete="username" value={userName} onChange={(e) => setUserName(e.target.value)}
                placeholder="your_username" required aria-invalid={!!error} className={inputCls} />
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-ink-soft">
                  Email <span className="text-ink-faint font-normal">(optional)</span>
                </Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputCls} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-ink-soft">Password</Label>
              <Input id="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"}
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
                required aria-invalid={!!error} className={inputCls} />
            </div>

            {error && (
              <p role="alert" className="text-sm text-brick bg-brick-tint/60 border border-brick/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-pine px-6 py-3 text-paper-2 font-medium hover:bg-pine-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Please wait…</>
              ) : (
                <>{isLogin ? "Sign in" : "Create account"}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null) }}
              className="font-medium text-pine hover:text-gold-2 transition-colors underline underline-offset-4 decoration-line-2"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
