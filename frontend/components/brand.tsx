import { cn } from "@/lib/utils"

/** Apothecary seal mark — a pine roundel with a gold cross and hairline ring. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="19" fill="var(--pine)" />
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="1.5 2.5" opacity="0.8" />
        <path d="M20 11.5v17M11.5 20h17" stroke="var(--paper-2)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.2" fill="var(--gold)" />
      </svg>
    </span>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <BrandMark className="w-8 h-8 translate-y-1" />
      <span className="font-display font-semibold tracking-tight text-ink text-xl">
        Medi<span className="text-pine">Chain</span>
      </span>
    </span>
  )
}
