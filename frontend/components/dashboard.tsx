"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, ShieldCheck, History, Settings, Menu, X, LogOut, Loader2,
  Wallet, CheckCircle2, XCircle, FileText, Inbox, ArrowUpRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useState } from "react"
import type { DashboardTab } from "@/app/page"
import { FileDropzone } from "@/components/file-dropzone"
import { BrandMark } from "@/components/brand"
import { api, ApiError, type AuthUser, type SubmitResult, type VerifyResult, type HistoryItem } from "@/lib/api"
import { connectWallet } from "@/lib/wallet"
import { cn } from "@/lib/utils"

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

function primaryBtn(extra = "") {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-lg bg-pine px-7 py-3 text-paper-2 font-medium",
    "hover:bg-pine-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", extra,
  )
}

function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow text-gold-2">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-ink-soft">{sub}</p>
    </div>
  )
}

function AddressField({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [walletError, setWalletError] = useState<string | null>(null)
  const autofill = async () => {
    setWalletError(null)
    try { onChange(await connectWallet()) }
    catch (e) { setWalletError(e instanceof Error ? e.message : "Wallet connection failed") }
  }
  return (
    <div className="space-y-1.5">
      <Label htmlFor="patientAddress" className="text-ink-soft">Patient Ethereum Address</Label>
      <div className="flex gap-2">
        <Input id="patientAddress" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0x…"
          disabled={disabled} spellCheck={false}
          className="border-line-2 bg-paper-2/60 focus-visible:border-pine focus-visible:ring-pine/30 font-mono h-11" />
        <button type="button" onClick={autofill} disabled={disabled}
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-line-2 bg-paper-2 px-4 text-ink hover:border-pine hover:text-pine transition-colors disabled:opacity-50">
          <Wallet className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline text-sm font-medium">Wallet</span>
        </button>
      </div>
      {walletError && <p className="text-sm text-amber">{walletError}</p>}
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
        <PageHead eyebrow="Record" title="New Analysis" sub="Recording new reports is reserved for clinicians." />
        <div className="rounded-xl border border-line-2 bg-paper-2 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-tint">
            <ShieldCheck className="w-6 h-6 text-gold-2" aria-hidden="true" />
          </div>
          <p className="font-display text-lg text-ink">This area is for clinicians</p>
          <p className="mt-1 text-sm text-ink-soft">Your account is a patient — you can verify documents and view your history.</p>
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
      clearInterval(interval); setProgress(100)
      setTimeout(() => onUploadSuccess(res.data), 400)
    } catch (e) {
      clearInterval(interval); setProgress(null)
      setError(e instanceof ApiError ? e.message : "Submission failed. Please try again.")
    }
  }

  const busy = progress !== null
  return (
    <div className="max-w-2xl">
      <PageHead eyebrow="Record" title="New Analysis" sub="Upload a medical document to analyse and anchor it on-chain." />
      <div className="space-y-6">
        <AddressField value={address} onChange={setAddress} disabled={busy} />
        <FileDropzone file={file} onFileSelected={setFile} disabled={busy} id="submit-file" />

        {busy && (
          <div aria-live="polite" className="rounded-xl border border-line-2 bg-paper-2 p-4">
            <div className="mb-2 flex items-center gap-2 text-ink">
              <Loader2 className="w-4 h-4 animate-spin text-pine" aria-hidden="true" />
              <span className="text-sm font-medium">Analysing · pinning to IPFS · writing on-chain…</span>
            </div>
            <Progress value={progress ?? 0} className="h-1.5" />
          </div>
        )}

        {error && <p role="alert" className="text-sm text-brick bg-brick-tint/60 border border-brick/20 rounded-lg px-4 py-2.5">{error}</p>}

        <button onClick={submit} disabled={busy || !file} className={primaryBtn()}>
          Submit Report <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
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
    setError(null); setResult(null)
    if (!file) return setError("Please select the document to verify.")
    if (!ADDRESS_RE.test(address)) return setError("Enter a valid Ethereum address.")
    setLoading(true)
    try { setResult(await api.verifyReport({ file, patientAddress: address }, token)) }
    catch (e) { setError(e instanceof ApiError ? e.message : "Verification failed. Please try again.") }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">
      <PageHead eyebrow="Verify" title="Verify Document" sub="Check whether a document matches the record stored on-chain." />
      <div className="space-y-6">
        <AddressField value={address} onChange={setAddress} disabled={loading} />
        <FileDropzone file={file} onFileSelected={setFile} disabled={loading} id="verify-file" />

        {error && <p role="alert" className="text-sm text-brick bg-brick-tint/60 border border-brick/20 rounded-lg px-4 py-2.5">{error}</p>}

        {result && (
          <div role="status" className={cn("flex items-start gap-3 rounded-xl border p-5",
            result.valid ? "border-moss/25 bg-moss-tint/60" : "border-brick/25 bg-brick-tint/50")}>
            {result.valid ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-moss" aria-hidden="true" />
              : <XCircle className="w-6 h-6 flex-shrink-0 text-brick" aria-hidden="true" />}
            <div>
              <p className={cn("font-display text-lg", result.valid ? "text-moss" : "text-brick")}>
                {result.valid ? "Authentic" : "Not verified"}
              </p>
              <p className={cn("text-sm", result.valid ? "text-moss" : "text-brick")}>{result.message}</p>
            </div>
          </div>
        )}

        <button onClick={verify} disabled={loading || !file} className={primaryBtn()}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : "Verify Document"}
        </button>
      </div>
    </div>
  )
}

const statusColor: Record<string, string> = {
  valid: "text-moss", recorded: "text-moss", tampered: "text-brick", repudiated: "text-brick",
}

function HistoryTab({ token }: Pick<DashboardProps, "token">) {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null); setItems(null)
    try { setItems((await api.getHistory(token)).data) }
    catch (e) { setError(e instanceof ApiError ? e.message : "Could not load history.") }
  }, [token])

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-3xl">
      <PageHead eyebrow="Activity" title="History" sub="Your recent submissions and verifications." />

      {error && (
        <div className="py-12 text-center">
          <p role="alert" className="mb-4 text-brick">{error}</p>
          <button onClick={load} className="rounded-lg border border-line-2 bg-paper-2 px-5 py-2 text-ink hover:border-pine transition-colors">Retry</button>
        </div>
      )}

      {!error && items === null && (
        <div className="flex justify-center py-16" aria-live="polite">
          <Loader2 className="w-6 h-6 animate-spin text-pine" aria-hidden="true" />
          <span className="sr-only">Loading history</span>
        </div>
      )}

      {!error && items && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-line-2 py-16 text-center text-ink-soft">
          <Inbox className="mx-auto mb-3 h-11 w-11 text-line-2" aria-hidden="true" />
          <p className="font-display text-lg text-ink">No activity yet</p>
          <p className="text-sm">Submit or verify a report to see it here.</p>
        </div>
      )}

      {!error && items && items.length > 0 && (
        <ul className="divide-y divide-line rounded-xl border border-line-2 bg-paper-2 overflow-hidden">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4 hover:bg-paper/40 transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pine-tint">
                <FileText className="h-5 w-5 text-pine" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.file_name || "Report"}</p>
                <p className="truncate font-mono text-xs text-ink-faint">{item.patient_address}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1">
                <span className="rounded-full border border-line-2 bg-paper px-2.5 py-0.5 text-xs font-medium capitalize text-ink-soft">{item.action}</span>
                <span className={cn("font-mono text-[0.7rem] capitalize", statusColor[item.status] || "text-ink-faint")}>{item.status}</span>
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
    api.health().then((h) => active && setHealth((h as { status?: string }).status === "ok" ? "ok" : "down"))
      .catch(() => active && setHealth("down"))
    return () => { active = false }
  }, [])

  const rows: [string, string][] = [["Username", user.userName]]
  if (user.email) rows.push(["Email", user.email])
  rows.push(["Role", user.role])

  return (
    <div className="max-w-2xl">
      <PageHead eyebrow="Account" title="Settings" sub="Your account details and platform status." />
      <div className="overflow-hidden rounded-xl border border-line-2 bg-paper-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-line px-6 py-4 last:border-0">
            <span className="eyebrow text-ink-faint">{k}</span>
            <span className="font-medium capitalize text-ink">{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="eyebrow text-ink-faint">Platform status</span>
          <span className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", health === "ok" ? "bg-moss" : health === "down" ? "bg-brick" : "bg-line-2 animate-pulse")} />
            <span className="font-medium text-ink">{health === "checking" ? "Checking…" : health === "ok" ? "Operational" : "Unavailable"}</span>
          </span>
        </div>
      </div>

      <button onClick={onLogout} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brick/30 px-5 py-2.5 text-brick hover:bg-brick-tint/50 transition-colors">
        <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
      </button>
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
    <ul className="space-y-1">
      {navItems.map((item) => {
        const active = activeTab === item.id
        return (
          <li key={item.id}>
            <button
              onClick={() => { onTabChange(item.id); onSelect?.() }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 transition-colors",
                active ? "bg-pine-tint text-pine" : "text-ink-soft hover:bg-paper hover:text-ink",
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />}
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-line bg-paper-2 md:flex">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
          <BrandMark className="h-9 w-9" />
          <span className="font-display text-xl text-ink">MediChain</span>
        </div>
        <nav className="flex-1 p-3" aria-label="Dashboard"><NavList /></nav>
        <div className="flex items-center gap-3 border-t border-line p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-paper-2" aria-hidden="true">
            <span className="text-xs font-semibold">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user.userName}</p>
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-faint">{user.role}</p>
          </div>
          <button onClick={onLogout} aria-label="Sign out" className="text-ink-faint hover:text-brick transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-line bg-paper-2 md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" />
            <span className="font-display text-lg text-ink">MediChain</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} className="text-ink">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-line">
              <nav className="p-3" aria-label="Dashboard"><NavList onSelect={() => setMobileMenuOpen(false)} /></nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="flex-1 bg-paper px-5 pb-10 pt-20 md:px-10 md:pt-10">
        <div key={activeTab} className="fade-up">{renderTab()}</div>
      </main>
    </div>
  )
}
