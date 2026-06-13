// src/components/BottomNav.jsx
import React from 'react';
import { Camera, Clock, Settings, BookOpen, Home } from 'lucide-react';
import ThemeToggle from './UI/ThemeToggle';
import LanguageSwitcher from './UI/LanguageSwitcher';

/**
 * Mobile‑first bottom navigation bar.
 * Visible on screens <640px (Tailwind "sm").
 * Mirrors the tabs used in the app state.
 */
const BottomNav = ({ activeTab, setActiveTab, onCapture, show }) => {
  const fileInputRef = React.useRef(null);

  return (
    <div className={`fixed left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/40 rounded-3xl z-50 px-2 py-2 shadow-2xl block sm:hidden transition-all duration-500 ease-out ${
      show 
        ? 'bottom-4 opacity-100 translate-y-0' 
        : '-bottom-24 opacity-0 translate-y-10 pointer-events-none'
    }`}>
      <div className="w-full flex justify-between items-center px-2">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Home"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Home size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Home</span>
        </button>
        {/* History */}
        <button
          onClick={() => setActiveTab('history')}
          aria-label="History"
          aria-current={activeTab === 'history' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'history' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Clock size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">History</span>
        </button>
        {/* Scanner (central button) */}
        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          aria-label="Open Scanner"
          className="relative -mt-8 mx-2"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform bg-emerald-500 border-4 border-white hover:scale-105 active:scale-95`}
          >
            <Camera size={26} className="text-white" aria-hidden="true" />
          </div>
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={onCapture}
          className="hidden" 
        />

        {/* Library */}
        <button
          onClick={() => setActiveTab('library')}
          aria-label="Library"
          aria-current={activeTab === 'library' ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'library' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <BookOpen size={22} aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-wider">Library</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
