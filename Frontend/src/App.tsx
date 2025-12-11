import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard />;
}
