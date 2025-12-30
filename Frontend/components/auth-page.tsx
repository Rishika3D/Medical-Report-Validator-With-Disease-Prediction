"use client"

import { motion } from "framer-motion"
import { Cross, ArrowLeft, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import type { AppView } from "@/app/page"

interface AuthPageProps {
  onNavigate: (view: AppView) => void
  userType: "doctor" | "patient"
  setUserType: (type: "doctor" | "patient") => void
}

export default function AuthPage({ onNavigate, userType, setUserType }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/blurred-medical-hospital-background-abstract.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Back button */}
      <button
        onClick={() => onNavigate("landing")}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <Cross className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">MediChain</span>
            </div>
            <p className="text-slate-600 text-sm">
              {isLogin ? "Welcome back! Please sign in." : "Create your account to get started."}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* User Type Tabs */}
            <Tabs value={userType} onValueChange={(v) => setUserType(v as "doctor" | "patient")} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100">
                <TabsTrigger
                  value="patient"
                  className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  Patient
                </TabsTrigger>
                <TabsTrigger
                  value="doctor"
                  className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  Doctor
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Dr. John Doe"
                    className="rounded-xl border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-xl border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>
              {userType === "doctor" && !isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-slate-700">
                    Medical License Number
                  </Label>
                  <Input
                    id="license"
                    placeholder="ML-123456"
                    className="rounded-xl border-slate-200 focus:border-teal-600 focus:ring-teal-600"
                  />
                </div>
              )}
              <Button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-5"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">or</span>
              </div>
            </div>

            {/* MetaMask Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate("dashboard")}
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl py-5 flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>

            {/* Toggle Login/Signup */}
            <p className="text-center text-sm text-slate-600 mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-teal-600 hover:text-teal-700 font-medium">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
