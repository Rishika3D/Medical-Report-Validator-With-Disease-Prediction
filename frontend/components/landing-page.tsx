"use client"

import { motion } from "framer-motion"
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react"
import { useState } from "react"
import type { AppView, DashboardTab } from "@/app/page"
import { BrandMark, Wordmark } from "@/components/brand"

interface LandingPageProps {
  onNavigate: (view: AppView) => void
  onGetStarted: (tab: DashboardTab) => void
  isAuthenticated: boolean
}

const features = [
  {
    n: "01",
    title: "AI-assisted reading",
    body: "Reports and X-rays are analysed by models served through HuggingFace, with graceful fallback.",
  },
  {
    n: "02",
    title: "Pinned to IPFS",
    body: "The original document is pinned to IPFS, so the source of truth is always retrievable.",
  },
  {
    n: "03",
    title: "Anchored on-chain",
    body: "A SHA-256 fingerprint is written to Ethereum — immutable, timestamped, verifiable by anyone.",
  },
]

const steps = [
  { k: "Upload", v: "A clinician submits a report for a patient address." },
  { k: "Analyse", v: "AI reads the document; it is pinned to IPFS." },
  { k: "Anchor", v: "Its hash is committed on-chain as permanent proof." },
  { k: "Verify", v: "Anyone can re-check a file against the record." },
]

export default function LandingPage({ onNavigate, onGetStarted, isAuthenticated }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 85% -10%, rgba(16,59,44,0.10), transparent 55%), radial-gradient(90% 60% at 5% 110%, rgba(176,129,42,0.10), transparent 50%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-20 border-b border-line/70">
        <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-18 py-4 flex items-center justify-between" aria-label="Main">
          <Wordmark />
          <div className="hidden md:flex items-center gap-9">
            <a href="#how" className="eyebrow text-ink-soft hover:text-pine transition-colors">How it works</a>
            <a href="#features" className="eyebrow text-ink-soft hover:text-pine transition-colors">Features</a>
            <button
              onClick={() => (isAuthenticated ? onGetStarted("new") : onNavigate("auth"))}
              className="eyebrow group inline-flex items-center gap-1.5 text-pine hover:text-gold-2 transition-colors"
            >
              {isAuthenticated ? "Dashboard" : "Sign in"}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden border-t border-line px-5 py-4 flex flex-col gap-4">
            <a href="#how" className="eyebrow text-ink-soft">How it works</a>
            <a href="#features" className="eyebrow text-ink-soft">Features</a>
            <button onClick={() => (isAuthenticated ? onGetStarted("new") : onNavigate("auth"))} className="eyebrow text-pine text-left">
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </button>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="eyebrow text-gold-2 flex items-center gap-2.5"
            >
              <span className="h-px w-8 bg-gold-2/60" /> Decentralized health records
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 font-display text-[2.9rem] leading-[0.98] sm:text-6xl md:text-[4.4rem] text-ink font-medium tracking-tight text-balance"
            >
              Medical records you can <span className="italic text-pine">actually</span> trust.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-7 max-w-md text-lg text-ink-soft leading-relaxed text-pretty"
            >
              Record a report, read it with AI, pin the original to IPFS, and anchor a tamper-proof
              fingerprint on Ethereum — verifiable by anyone, owned by no one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.19 }}
              className="mt-10 flex flex-col sm:flex-row gap-3.5"
            >
              <button
                onClick={() => onGetStarted("new")}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-pine px-7 py-3.5 text-paper-2 font-medium hover:bg-pine-2 transition-colors shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_24px_-12px_rgba(16,59,44,0.6)]"
              >
                {isAuthenticated ? "Open dashboard" : "Get started"}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={() => onGetStarted("verify")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-2 bg-paper-2/60 px-7 py-3.5 text-ink font-medium hover:border-pine hover:text-pine transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> Verify a document
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-12 flex items-center gap-6 text-ink-faint"
            >
              <span className="eyebrow">Ethereum</span>
              <span className="h-3 w-px bg-line-2" />
              <span className="eyebrow">IPFS</span>
              <span className="h-3 w-px bg-line-2" />
              <span className="eyebrow">HuggingFace AI</span>
            </motion.div>
          </div>

          {/* Proof certificate visual */}
          <motion.div
            initial={{ opacity: 0, y: 26, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <ProofCertificate />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-t border-line/70 bg-paper-2/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-20">
          <p className="eyebrow text-gold-2 mb-10">What you get</p>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
            {features.map((f, i) => (
              <motion.div
                key={f.n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="md:px-8 first:md:pl-0 last:md:pr-0 py-8 md:py-0"
              >
                <span className="font-display text-4xl text-gold/70">{f.n}</span>
                <h3 className="mt-4 font-display text-xl text-ink">{f.title}</h3>
                <p className="mt-2.5 text-ink-soft leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 border-t border-line/70">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-[0.6fr_1fr] gap-10">
            <div>
              <p className="eyebrow text-gold-2">The flow</p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink tracking-tight">
                Four steps from<br /> report to proof.
              </h2>
            </div>
            <ol className="space-y-0">
              {steps.map((s, i) => (
                <motion.li
                  key={s.k}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-baseline gap-5 py-5 border-b border-line last:border-0"
                >
                  <span className="font-mono text-sm text-gold-2 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl text-ink w-28 shrink-0">{s.k}</span>
                  <span className="text-ink-soft">{s.v}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line/70 bg-pine text-paper-2/80">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <BrandMark className="w-8 h-8" />
            <span className="font-display text-lg text-paper-2">MediChain</span>
          </div>
          <p className="text-sm text-paper-2/60 max-w-sm">
            For demonstration only. AI output must not be used for real medical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  )
}

function ProofCertificate() {
  return (
    <div className="relative mx-auto max-w-sm">
      {/* Back plate */}
      <div className="absolute -inset-3 rounded-2xl bg-pine/5 -rotate-2" aria-hidden="true" />
      <div className="relative rounded-2xl border border-line-2 bg-paper-2 p-7 shadow-[0_30px_60px_-30px_rgba(16,59,44,0.35)]">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-ink-faint">Certificate of record</span>
          <BrandMark className="w-7 h-7" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-tint px-2.5 py-1 text-xs font-medium text-moss">
            <span className="w-1.5 h-1.5 rounded-full bg-moss" /> Authentic
          </span>
          <span className="font-mono text-xs text-ink-faint">block #1,284,097</span>
        </div>

        <dl className="mt-6 space-y-3.5">
          {[
            ["SHA-256", "f7c831…412651"],
            ["IPFS CID", "Qmd7E8…i1NwG"],
            ["Tx hash", "0x4ee364…3ec16c"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-line pt-3.5 first:border-0 first:pt-0">
              <dt className="eyebrow text-ink-faint">{k}</dt>
              <dd className="mt-1.5 font-mono text-sm text-ink break-all">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Wax seal */}
        <div className="mt-7 flex items-center justify-between">
          <span className="font-mono text-[0.7rem] text-ink-faint">chainId 31337 · Ethereum</span>
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-gold-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
