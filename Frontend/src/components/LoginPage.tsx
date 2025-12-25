import React, { useState } from 'react';
import { Activity, Lock, Mail, Eye, EyeOff, Sparkles, Shield, Zap, User, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

// 1. Define types for the data we expect from the backend
interface UserData {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  message?: string;
  token?: string;
  user?: UserData;
  error?: string;
}

interface LoginPageProps {
  onLogin: (user: UserData) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  // Form State
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login and Register
  const [username, setUsername] = useState(''); // Only used for Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [successMsg, setSuccessMsg] = useState(null as string | null);

  // 2. The Main Submission Handler
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    // #region agent log
    console.log('[DEBUG] handleSubmit called', { isLoginMode, email: email.substring(0,3)+'***', hasPassword: !!password, hasUsername: !!username });
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:40',message:'handleSubmit called',data:{isLoginMode,email:email.substring(0,3)+'***',hasPassword:!!password,hasUsername:!!username},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
    // #endregion
    e.preventDefault();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:42',message:'preventDefault called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Determine endpoint based on mode
    const endpoint = isLoginMode ? 'http://localhost:3000/auth/login' : 'http://localhost:3000/auth/register';
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:48',message:'preparing API call',data:{endpoint,isLoginMode},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Prepare payload
    const payload = isLoginMode 
      ? { email, password }
      : { username, email, password };

    try {
      console.log('[DEBUG] Making API request to:', endpoint, 'with payload:', { ...payload, password: '***' });
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log('[DEBUG] API response status:', response.status, response.statusText);
      } catch (fetchError: any) {
        console.error('[DEBUG] Fetch error:', fetchError);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:68',message:'fetch network error',data:{error:fetchError?.message||'Network error',errorType:fetchError?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        throw new Error(`Network error: ${fetchError.message || 'Failed to connect to backend. Please ensure the backend server is running on http://localhost:3000'}`);
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:64',message:'API response received',data:{status:response.status,ok:response.ok,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
      // #endregion

      let data: AuthResponse;
      try {
        const responseText = await response.text();
        console.log('[DEBUG] Raw response text:', responseText.substring(0, 200));
        try {
          data = JSON.parse(responseText);
          console.log('[DEBUG] Parsed API response data:', { 
            hasToken: !!data.token, 
            hasUser: !!data.user, 
            hasError: !!data.error, 
            message: data.message,
            userStructure: data.user ? { hasId: !!data.user.id, hasUsername: !!data.user.username, hasEmail: !!data.user.email } : null
          });
        } catch (parseError: any) {
          console.error('[DEBUG] Failed to parse JSON:', parseError);
          console.error('[DEBUG] Full response text:', responseText);
          throw new Error(`Invalid JSON response from server: ${parseError.message}. Response: ${responseText.substring(0, 100)}`);
        }
      } catch (jsonError: any) {
        console.error('[DEBUG] Error processing response:', jsonError);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:85',message:'JSON parse error',data:{error:jsonError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        throw jsonError;
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:63',message:'response data parsed',data:{hasToken:!!data.token,hasUser:!!data.user,hasError:!!data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:66',message:'API error response',data:{error:data.error||'Authentication failed'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLoginMode) {
        // --- LOGIN SUCCESS ---
        if (data.token && data.user) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:87',message:'login success, storing token',data:{hasToken:!!data.token,userId:data.user?.id,userHasId:!!data.user?.id,userHasUsername:!!data.user?.username,userHasEmail:!!data.user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          // Validate user data has all required fields
          if (!data.user.id || !data.user.username || !data.user.email) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:92',message:'user data validation failed',data:{user:data.user},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            throw new Error('Invalid user data received from server');
          }
          // Store token for future requests (like Upload)
          localStorage.setItem('token', data.token);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:98',message:'calling onLogin callback',data:{userId:data.user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          // Pass user data up to parent to change the view
          try {
            console.log('[DEBUG] Calling onLogin with user data:', { id: data.user.id, username: data.user.username, email: data.user.email.substring(0,3)+'***' });
            onLogin(data.user);
            console.log('[DEBUG] onLogin callback completed successfully');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:102',message:'onLogin callback completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
            // #endregion
          } catch (callbackError: any) {
            console.error('[DEBUG] onLogin callback error:', callbackError);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:105',message:'onLogin callback error',data:{error:callbackError?.message||'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
            // #endregion
            throw callbackError;
          }
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:110',message:'login response missing token or user',data:{hasToken:!!data.token,hasUser:!!data.user},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          throw new Error('Login response missing token or user data');
        }
      } else {
        // --- REGISTER SUCCESS ---
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:79',message:'registration success',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setSuccessMsg("Account created successfully! Please sign in.");
        setIsLoginMode(true); // Switch back to login mode automatically
        setUsername('');
        setPassword('');
      }

    } catch (err: any) {
      console.error('[DEBUG] Exception caught in handleSubmit:', err);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:120',message:'exception caught',data:{error:err?.message||'Unknown error',errorType:err?.name,stack:err?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((logErr)=>console.error('[DEBUG] Log fetch error:', logErr));
      // #endregion
      
      // Better error messages based on error type
      let errorMessage = 'Something went wrong.';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.name === 'TypeError' && err.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check if the backend server is running on http://localhost:3000';
      } else if (err.name === 'SyntaxError') {
        errorMessage = 'Invalid response from server. Please check if the backend is running correctly.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:91',message:'handleSubmit completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ boxShadow: '0 0 80px 40px rgba(0, 240, 255, 0.2)' }} />
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 neon-glow-green">
                <Zap size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-white mb-1">Real-time Disease Prediction</h4>
                <p className="text-sm text-gray-300">AI algorithms analyze patient data to predict disease risk</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 neon-glow-purple">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white mb-1">Automated Data Validation</h4>
                <p className="text-sm text-gray-300">Ensure data integrity with intelligent validation</p>
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
              <h2 className="text-cyan-400 neon-text-cyan mb-2">
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400">
                {isLoginMode ? 'Sign in to access your dashboard' : 'Join the medical AI revolution'}
              </p>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
                <Sparkles size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Username Field (Only show in Register Mode) */}
              {!isLoginMode && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <Label htmlFor="username" className="text-gray-300">Full Name / Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Dr. Strange"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-black/40 border border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:neon-glow-cyan"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

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

              {/* Remember Me (Only in Login Mode) */}
              {isLoginMode && (
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all neon-glow-cyan hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      {isLoginMode ? 'Sign In' : 'Create Account'}
                      <Sparkles size={16} />
                    </>
                  )}
                </span>
              </button>

            </form>

            {/* Switch Modes Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium ml-1"
                >
                  {isLoginMode ? "Request Access" : "Sign In"}
                </button>
              </p>
            </div>
            
            {/* Optional: Keep SSO or remove if not implemented */}
             <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black/80 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                 {/* ... SSO Buttons ... */}
                 <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-black/60 transition-all text-gray-300"><span className="text-sm">Google</span></button>
                 <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:bg-black/60 transition-all text-gray-300"><span className="text-sm">SSO</span></button>
              </div>

          </div>

          <p className="text-xs text-center text-gray-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}