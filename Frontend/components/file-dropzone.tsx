"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Upload, FileText, X } from "lucide-react"

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

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

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
        <div className="border-2 border-slate-200 rounded-2xl p-6 flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-teal-600" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onFileSelected(null)}
              aria-label="Remove file"
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragging(false)
          }}
          onDrop={handleDrop}
          disabled={disabled}
          className={`w-full border-2 border-dashed rounded-2xl p-10 md:p-12 text-center transition-all ${
            isDragging ? "border-teal-600 bg-teal-50" : "border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600`}
        >
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-teal-600" aria-hidden="true" />
          </div>
          <p className="text-base font-semibold text-slate-800">Drop your file here, or click to browse</p>
          <p className="text-sm text-slate-500 mt-1">X-Ray (PNG/JPG) or Lab Report (PDF) · max 10 MB</p>
        </button>
      )}

      {localError && (
        <p role="alert" className="mt-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
          {localError}
        </p>
      )}
    </div>
  )
}
