import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

interface UserData {
  id: number;
  username: string;
  email: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null as UserData | null);

  const handleLogin = (userData: UserData) => {
    console.log('[DEBUG] App.tsx handleLogin called with userData:', { id: userData.id, username: userData.username, email: userData.email.substring(0,3)+'***' });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:15',message:'handleLogin called',data:{userId:userData.id,username:userData.username,email:userData.email.substring(0,3)+'***'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
    // #endregion
    try {
      setUser(userData);
      setIsLoggedIn(true);
      console.log('[DEBUG] App.tsx login state updated successfully');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:19',message:'login state updated',data:{isLoggedIn:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch((err)=>console.error('[DEBUG] Log fetch error:', err));
      // #endregion
    } catch (error: any) {
      console.error('[DEBUG] App.tsx error updating login state:', error);
      throw error;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard />;
}
