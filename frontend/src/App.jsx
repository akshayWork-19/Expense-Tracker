import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login';
import Register from './pages/Register';
import { Button } from '@/components/ui/button';
import { useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

function App() {
  // const [activeTab, setActiveTab] = useState('dashboard');
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('login');
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark for comfort
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }



    if (!isAuthenticated) {
      return view === 'login' ? (
        <Login onSwitchToRegister={() => setView('register')} />
      ) : (
        <Register onSwitchToLogin={() => setView('login')} />
      )
    }


    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <nav className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tight text-foreground">
                ExpenseTracker
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full w-10 h-10 hover:bg-muted"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <span className="text-xl">🌙</span>
                ) : (
                  <span className="text-xl">☀️</span>
                )}
              </Button>

              <div className="h-6 w-[1px] bg-border hidden md:block"></div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                  {user?.username}
                </span>
                <Button variant="secondary" size="sm" onClick={logout} className="font-semibold">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Dashboard />
        </main>
      </div>
    )
  }

  return (
    <>
      {renderContent()}
      {/* Move Toaster here so it's always available */}
      {/* Also fixed 'richColors' casing */}
      <Toaster position="top-right" />
    </>
  );
}




export default App
