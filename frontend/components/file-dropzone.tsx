"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCEPT = ".jpg,.jpeg,.png,.pdf"
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]
const MAX_BYTES = 10 * 1024 * 1024

interface FileDropzoneProps {
  file: File | null
  onFileSelected: (file: File | null) => void
  disabled?: boolean
  id?: string
}

export function FileDropzone({ file, onFileSelected, disabled, id = "file-input" }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndSet = useCallback(
    (selected: File | undefined) => {
      if (!selected) return
      if (!ALLOWED_TYPES.includes(selected.type)) {
        setLocalError("Unsupported file type. Use JPG, PNG, or PDF.")
        return
      }
      if (selected.size > MAX_BYTES) {
        setLocalError("File is too large. Maximum size is 10 MB.")
        return
      }
      setLocalError(null)
      onFileSelected(selected)
    },
    [onFileSelected],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      validateAndSet(e.dataTransfer.files[0])
    },
    [disabled, validateAndSet],
  )

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />

      {file ? (
        <div className="flex items-center gap-4 rounded-xl border border-line-2 bg-paper-2 p-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-pine-tint">
            <FileText className="h-6 w-6 text-pine" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink">{file.name}</p>
            <p className="font-mono text-xs text-ink-faint">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          {!disabled && (
            <button type="button" onClick={() => onFileSelected(null)} aria-label="Remove file"
              className="p-1 text-ink-faint hover:text-brick transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
          onDrop={handleDrop}
          disabled={disabled}
          className={cn(
            "group w-full rounded-xl border border-dashed p-10 md:p-12 text-center transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/40",
            isDragging ? "border-pine bg-pine-tint/50" : "border-line-2 bg-paper-2/50 hover:border-pine/60 hover:bg-paper-2",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          )}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-pine-tint transition-transform group-hover:-translate-y-0.5">
            <Upload className="h-6 w-6 text-pine" aria-hidden="true" />
          </div>
          <p className="font-display text-lg text-ink">Drop your file here, or click to browse</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-faint">
            PNG · JPG · PDF — max 10 MB
          </p>
        </button>
      )}

      {localError && (
        <p role="alert" className="mt-2 text-sm text-brick bg-brick-tint/60 border border-brick/20 rounded-lg px-4 py-2.5">
          {localError}
        </p>
      )}
    </div>
  )
}
