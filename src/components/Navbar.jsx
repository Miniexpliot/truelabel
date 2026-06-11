import React from 'react';
import { Camera, Clock, Settings, User, Trophy } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/60 backdrop-blur-xl border-t border-slate-700/50 z-50 px-2 py-2 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto w-full flex justify-between items-center px-2">
        
        <button 
          onClick={() => setActiveTab('profile')}
          aria-label="Profile"
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Profile</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          aria-label="History"
          aria-current={activeTab === 'history' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'history' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Clock size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">History</span>
        </button>

        <button 
          onClick={() => setActiveTab('scanner')}
          aria-label="Open Scanner"
          aria-current={activeTab === 'scanner' ? 'page' : undefined}
          className="relative -mt-6 mx-2"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${activeTab === 'scanner' ? 'bg-emerald-500 scale-110 shadow-emerald-500/30' : 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/50'}`}>
            <Camera size={26} className="text-white" aria-hidden="true" />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('leaderboard')}
          aria-label="Global Leaderboard"
          aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'leaderboard' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Trophy size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Global</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          aria-label="Settings"
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Settings size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Config</span>
        </button>

      </div>
    </div>
  );
};

export default Navbar;
