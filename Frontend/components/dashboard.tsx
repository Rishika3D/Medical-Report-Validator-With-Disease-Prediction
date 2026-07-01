"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Cross, Plus, History, Settings, Menu, X, ShieldCheck, LogOut, Loader2,
  Wallet, CheckCircle2, XCircle, FileText, Inbox,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCallback, useEffect, useState } from "react"
import type { DashboardTab } from "@/app/page"
import { FileDropzone } from "@/components/file-dropzone"
import { api, ApiError, type AuthUser, type SubmitResult, type VerifyResult, type HistoryItem } from "@/lib/api"
import { connectWallet } from "@/lib/wallet"

interface DashboardProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  onUploadSuccess: (result: SubmitResult) => void
  onLogout: () => void
  user: AuthUser
  token: string
}

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/

const navItems: { id: DashboardTab; icon: typeof Plus; label: string }[] = [
  { id: "new", icon: Plus, label: "New Analysis" },
  { id: "verify", icon: ShieldCheck, label: "Verify Document" },
  { id: "history", icon: History, label: "History" },
  { id: "settings", icon: Settings, label: "Settings" },
]

function AddressField({
  value, onChange, disabled,
}: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [walletError, setWalletError] = useState<string | null>(null)
  const autofill = async () => {
    setWalletError(null)
    try {
      onChange(await connectWallet())
    } catch (e) {
      setWalletError(e instanceof Error ? e.message : "Wallet connection failed")
    }
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="patientAddress" className="text-slate-700">Patient Ethereum Address</Label>
      <div className="flex gap-2">
        <Input
          id="patientAddress"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0x…"
          disabled={disabled}
          spellCheck={false}
          className="border-slate-200 focus:border-teal-600 focus:ring-teal-600 font-mono"
        />
        <Button type="button" variant="outline" onClick={autofill} disabled={disabled} className="flex-shrink-0 gap-2">
          <Wallet className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Wallet</span>
        </Button>
      </div>
      {walletError && <p className="text-sm text-amber-700">{walletError}</p>}
    </div>
  )
}

function NewAnalysisTab({ token, user, onUploadSuccess }: Pick<DashboardProps, "token" | "user" | "onUploadSuccess">) {
  const [file, setFile] = useState<File | null>(null)
  const [address, setAddress] = useState("")
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = user.role === "doctor" || user.role === "admin"
  if (!canSubmit) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">New Analysis</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-teal-600" aria-hidden="true" />
          <p className="font-medium text-slate-800">Recording reports is for clinicians</p>
          <p className="text-sm text-slate-500 mt-1">
            Your account is registered as a patient. You can verify documents and view your history.
          </p>
        </div>
      </div>
    )
  }

  const submit = async () => {
    setError(null)
    if (!file) return setError("Please select a file to submit.")
    if (!ADDRESS_RE.test(address)) return setError("Enter a valid Ethereum address (0x followed by 40 hex characters).")

    setProgress(5)
    const interval = setInterval(() => setProgress((p) => (p !== null && p < 85 ? p + 5 : p)), 300)
    try {
      const res = await api.submitReport({ file, patientAddress: address }, token)
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => onUploadSuccess(res.data), 400)
    } catch (e) {
      clearInterval(interval)
      setProgress(null)
      setError(e instanceof ApiError ? e.message : "Submission failed. Please try again.")
    }
  }

  const busy = progress !== null
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">New Analysis</h1>
      <p className="text-slate-600 mb-8">Upload a medical document to analyse and record it on-chain.</p>

      <div className="space-y-6">
        <AddressField value={address} onChange={setAddress} disabled={busy} />
        <FileDropzone file={file} onFileSelected={setFile} disabled={busy} id="submit-file" />

        {busy && (
          <div aria-live="polite">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span className="text-sm font-medium">Analysing and recording on-chain…</span>
            </div>
            <Progress value={progress ?? 0} className="h-2" />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>
        )}

        <Button onClick={submit} disabled={busy || !file} className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto px-8 py-5">
          Submit Report
        </Button>
      </div>
    </div>
  )
}

function VerifyTab({ token }: Pick<DashboardProps, "token">) {
  const [file, setFile] = useState<File | null>(null)
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyResult | null>(null)

  const verify = async () => {
    setError(null)
    setResult(null)
    if (!file) return setError("Please select the document to verify.")
    if (!ADDRESS_RE.test(address)) return setError("Enter a valid Ethereum address.")

    setLoading(true)
    try {
      setResult(await api.verifyReport({ file, patientAddress: address }, token))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Verify Document</h1>
      <p className="text-slate-600 mb-8">Check whether a document matches the record stored on-chain.</p>

      <div className="space-y-6">
        <AddressField value={address} onChange={setAddress} disabled={loading} />
        <FileDropzone file={file} onFileSelected={setFile} disabled={loading} id="verify-file" />

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>
        )}

        {result && (
          <div
            role="status"
            className={`rounded-2xl p-5 flex items-start gap-3 ${result.valid ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}
          >
            {result.valid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className={`font-semibold ${result.valid ? "text-emerald-800" : "text-amber-800"}`}>
                {result.valid ? "Authentic" : "Not verified"}
              </p>
              <p className={`text-sm ${result.valid ? "text-emerald-700" : "text-amber-700"}`}>{result.message}</p>
            </div>
          </div>
        )}

        <Button onClick={verify} disabled={loading || !file} className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto px-8 py-5">
          {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Verifying…</span> : "Verify Document"}
        </Button>
      </div>
    </div>
  )
}

function HistoryTab({ token }: Pick<DashboardProps, "token">) {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    setItems(null)
    try {
      const res = await api.getHistory(token)
      setItems(res.data)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load history.")
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">History</h1>
      <p className="text-slate-600 mb-8">Your recent submissions and verifications.</p>

      {error && (
        <div className="text-center py-12">
          <p role="alert" className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" onClick={load}>Retry</Button>
        </div>
      )}

      {!error && items === null && (
        <div className="flex justify-center py-16" aria-live="polite">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600" aria-hidden="true" />
          <span className="sr-only">Loading history</span>
        </div>
      )}

      {!error && items && items.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300" aria-hidden="true" />
          <p className="font-medium text-slate-700">No activity yet</p>
          <p className="text-sm">Submit or verify a report to see it here.</p>
        </div>
      )}

      {!error && items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-slate-500" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{item.file_name || "Report"}</p>
                <p className="text-xs text-slate-500 font-mono truncate">{item.patient_address}</p>
                <p className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge variant="outline" className="capitalize">{item.action}</Badge>
                <span className="text-xs text-slate-500 capitalize">{item.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SettingsTab({ user, onLogout }: Pick<DashboardProps, "user" | "onLogout">) {
  const [health, setHealth] = useState<"checking" | "ok" | "down">("checking")

  useEffect(() => {
    let active = true
    api
      .health()
      .then((h) => active && setHealth((h as { status?: string }).status === "ok" ? "ok" : "down"))
      .catch(() => active && setHealth("down"))
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-600 mb-8">Your account and service status.</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between"><span className="text-slate-500">Username</span><span className="font-medium text-slate-800">{user.userName}</span></div>
        {user.email && <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-800">{user.email}</span></div>}
        <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-800 capitalize">{user.role}</span></div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">API status</span>
          <span className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${health === "ok" ? "bg-emerald-500" : health === "down" ? "bg-red-500" : "bg-slate-300"}`} />
            <span className="font-medium text-slate-800">{health === "checking" ? "Checking…" : health === "ok" ? "Operational" : "Unavailable"}</span>
          </span>
        </div>
      </div>

      <Button variant="outline" onClick={onLogout} className="mt-6 gap-2 text-red-600 border-red-200 hover:bg-red-50">
        <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
      </Button>
    </div>
  )
}

export default function Dashboard({ activeTab, onTabChange, onUploadSuccess, onLogout, user, token }: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const initials = user.userName.slice(0, 2).toUpperCase()

  const renderTab = () => {
    switch (activeTab) {
      case "new": return <NewAnalysisTab token={token} user={user} onUploadSuccess={onUploadSuccess} />
      case "verify": return <VerifyTab token={token} />
      case "history": return <HistoryTab token={token} />
      case "settings": return <SettingsTab user={user} onLogout={onLogout} />
    }
  }

  const NavList = ({ onSelect }: { onSelect?: () => void }) => (
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => { onTabChange(item.id); onSelect?.() }}
            aria-current={activeTab === item.id ? "page" : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === item.id ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
            <Cross className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-slate-800">MediChain</span>
        </div>
        <nav className="flex-1 p-4" aria-label="Dashboard"><NavList /></nav>
        <div className="p-4 border-t border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center" aria-hidden="true">
            <span className="text-slate-600 font-medium text-sm">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user.userName}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
          <button onClick={onLogout} aria-label="Sign out" className="text-slate-400 hover:text-slate-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Cross className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-slate-800">MediChain</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} className="text-slate-600">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-slate-200 bg-white overflow-hidden">
              <nav className="p-4" aria-label="Dashboard"><NavList onSelect={() => setMobileMenuOpen(false)} /></nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {renderTab()}
        </motion.div>
      </main>
    </div>
  )
}
