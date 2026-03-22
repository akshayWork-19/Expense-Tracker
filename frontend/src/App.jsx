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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                E
              </div>
              <span className="text-xl font-bold tracking-tight">ExpenseTrack</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hey, {user?.username}
              </span>

              <Button onClick={logout}>
                Log out
              </Button>

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
