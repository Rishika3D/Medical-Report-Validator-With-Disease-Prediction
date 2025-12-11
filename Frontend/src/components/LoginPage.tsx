import React, { useState } from 'react';
import { Activity, Lock, Mail, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    onLogin();
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Neon Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ boxShadow: '0 0 100px 50px rgba(0, 240, 255, 0.3)' }} />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000" style={{ boxShadow: '0 0 100px 50px rgba(255, 0, 153, 0.3)' }} />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000" style={{ boxShadow: '0 0 100px 50px rgba(180, 0, 255, 0.3)' }} />
        </div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ boxShadow: '0 0 80px 40px rgba(0, 240, 255, 0.2)' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000" style={{ boxShadow: '0 0 80px 40px rgba(255, 0, 153, 0.2)' }} />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center neon-glow-cyan animate-neon-pulse">
              <Activity size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-cyan-400 neon-text-cyan">Medical AI Insights</h1>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles size={12} className="text-pink-400" />
                <span className="text-xs text-pink-400">Powered by AI</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl mb-6 text-white neon-text-cyan">
            Advanced Healthcare Analytics Platform
          </h2>
          
          <p className="text-lg text-gray-300 mb-12 leading-relaxed">
            Leverage AI-powered insights for disease prediction, data validation, 
            and comprehensive medical analysis.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 neon-glow-green group-hover:scale-110 transition-transform">
                <Zap size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-white mb-1">Real-time Disease Prediction</h4>
                <p className="text-sm text-gray-300">
                  AI algorithms analyze patient data to predict disease risk with high accuracy
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 neon-glow-purple group-hover:scale-110 transition-transform">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1">Automated Data Validation</h4>
                <p className="text-sm text-gray-300">
                  Ensure data integrity with intelligent validation and inconsistency detection
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 neon-glow-pink group-hover:scale-110 transition-transform">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1">Comprehensive Reporting</h4>
                <p className="text-sm text-gray-300">
                  Generate detailed reports with actionable insights for healthcare professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center neon-glow-cyan">
              <Activity size={24} className="text-black" />
            </div>
            <h2 className="text-cyan-400 neon-text-cyan">Medical AI Insights</h2>
          </div>

          <div className="bg-black/80 backdrop-blur-xl rounded-3xl neon-border-cyan p-8">
            <div className="mb-8 text-center">
              <h2 className="text-cyan-400 neon-text-cyan mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your AI-powered dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:neon-glow-cyan"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-black/40 border border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:neon-glow-cyan"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="cursor-pointer text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all neon-glow-cyan hover:scale-[1.02] transform"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <Sparkles size={16} />
                </span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black/80 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-black/60 transition-all text-gray-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-black/60 transition-all text-gray-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="text-sm">SSO</span>
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button className="text-cyan-400 hover:text-cyan-300">
                  Request Access
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}