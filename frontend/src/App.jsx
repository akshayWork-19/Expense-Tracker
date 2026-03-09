import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">ExpenseTrack</span>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-slate-100 font-medium text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
              Dashboard
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-all text-sm font-medium"
            >
              Log Out
            </button>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  )
}

export default App
