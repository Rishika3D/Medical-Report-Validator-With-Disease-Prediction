"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  Cross,
  Plus,
  History,
  Settings,
  Menu,
  X,
  Upload,
  FileText,
  ImageIcon,
  FileSpreadsheet,
  LogOut,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useRef } from "react"
import type { AppView, SubmitResult } from "@/app/page"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface DashboardProps {
  onNavigate: (view: AppView) => void
  onUploadSuccess: (result: SubmitResult) => void
  onLogout: () => void
  userType: "doctor" | "patient"
  token: string
}

type NavItem = "new" | "history" | "settings"

export default function Dashboard({ onNavigate, onUploadSuccess, onLogout, userType, token }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<NavItem>("new")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [patientAddress, setPatientAddress] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navItems = [
    { id: "new" as NavItem, icon: Plus, label: "New Analysis" },
    { id: "history" as NavItem, icon: History, label: "Patient History" },
    { id: "settings" as NavItem, icon: Settings, label: "Settings" },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    if (!patientAddress.match(/^0x[0-9a-fA-F]{40}$/)) {
      setUploadError("Please enter a valid Ethereum address (0x...)")
      return
    }

    setUploadError(null)
    setUploadProgress(0)

    // Simulate visual progress while the real request is in flight
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev !== null && prev < 85 ? prev + 5 : prev))
    }, 300)

    try {
      const formData = new FormData()
      formData.append("report", selectedFile)
      formData.append("patientAddress", patientAddress)

      const res = await fetch(`${API_URL}/reports/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      clearInterval(interval)
      setUploadProgress(100)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setTimeout(() => {
        onUploadSuccess(data.data as SubmitResult)
      }, 400)
    } catch (err: unknown) {
      clearInterval(interval)
      setUploadProgress(null)
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cross className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="text-xl font-bold text-slate-800">MediChain</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-slate-400 hover:text-slate-600 ${!sidebarOpen && "hidden"}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeNav === item.id ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-100"
                  } ${!sidebarOpen && "justify-center"}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className={`p-4 border-t border-slate-200 ${!sidebarOpen && "flex justify-center"}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">John Doe</p>
                <p className="text-xs text-slate-500 capitalize">{userType}</p>
              </div>
              <button onClick={onLogout} className="text-slate-400 hover:text-slate-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={onLogout} className="text-slate-400 hover:text-slate-600">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Cross className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">MediChain</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 bg-white"
            >
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveNav(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          activeNav === item.id ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">New Analysis</h1>
            <p className="text-slate-600 mb-8">Upload a medical document to begin AI-powered diagnostics</p>

            {/* Patient Address Field */}
            <div className="mb-6 space-y-2">
              <Label htmlFor="patientAddress" className="text-slate-700">
                Patient Ethereum Address
              </Label>
              <Input
                id="patientAddress"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="0xABCD..."
                disabled={uploadProgress !== null}
                className="rounded-xl border-slate-200 focus:border-teal-600 focus:ring-teal-600 font-mono"
              />
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={handleFileInput}
            />

            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => uploadProgress === null && !selectedFile && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 md:p-16 text-center transition-all duration-300 ${
                isDragging
                  ? "border-teal-600 bg-teal-50"
                  : "border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50"
              } ${uploadProgress !== null ? "pointer-events-none" : selectedFile ? "" : "cursor-pointer"}`}
            >
              {uploadProgress !== null ? (
                <div className="py-8">
                  <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Upload className="w-8 h-8 text-teal-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Uploading and analyzing...</h3>
                  <div className="max-w-xs mx-auto">
                    <Progress value={uploadProgress} className="h-2 mb-2" />
                    <p className="text-sm text-slate-500">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="py-4">
                  <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-lg font-semibold text-slate-800 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500 mb-6">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                      className="rounded-xl"
                    >
                      Change file
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleSubmit() }}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                    >
                      Submit Report
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <motion.div animate={{ y: isDragging ? -10 : 0 }} className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-teal-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Drop your file here, or click to browse</h3>
                  <p className="text-slate-500 mb-6">Drop X-Ray (PNG), Lab Report (PDF), or ECG (CSV)</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600">
                      <ImageIcon className="w-4 h-4" />
                      PNG
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600">
                      <FileText className="w-4 h-4" />
                      PDF
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600">
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV
                    </div>
                  </div>
                </>
              )}
            </div>

            {uploadError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{uploadError}</p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
