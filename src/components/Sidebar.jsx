import React from 'react';
import { Camera, Clock, Settings, BookOpen, Activity, Home } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onCapture }) => {
  const fileInputRef = React.useRef(null);

  const NavItem = ({ tab, icon: Icon, label }) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex items-center justify-center md:justify-start gap-4 px-2 md:px-4 py-3 w-full rounded-2xl transition-all duration-200 ${
          isActive 
            ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
      >
        <Icon size={22} />
        <span className="font-semibold tracking-wider text-sm hidden md:block">{label}</span>
      </button>
    );
  };

  return (
    <div className="h-full w-20 md:w-64 flex flex-col items-center md:items-start py-8 px-2 md:px-4 gap-8 glass-panel z-50">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 w-full justify-center md:justify-start">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md">
          <Activity size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 hidden md:block tracking-wide truncate">
          TrueLabel
        </span>
      </div>

      <div className="flex flex-col gap-3 w-full mt-4 flex-1">
        
        {/* Scanner Big Button */}
        <button 
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className={`flex items-center justify-center md:justify-start gap-4 p-3 md:px-4 md:py-3 w-full rounded-2xl transition-all duration-300 shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95`}
        >
          <Camera size={24} />
          <span className="font-bold tracking-wider text-sm hidden md:block">SCAN NOW</span>
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={onCapture}
          className="hidden" 
        />

        <div className="w-full h-px bg-slate-100 my-2"></div>

        <NavItem tab="home" icon={Home} label="HOME" />
        <NavItem tab="history" icon={Clock} label="HISTORY" />
        <NavItem tab="library" icon={BookOpen} label="LIBRARY" />
      </div>

      <div className="mt-auto w-full flex justify-center md:justify-start px-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center justify-center md:justify-start gap-3 w-full transition-colors ${activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Settings size={20} />
          <span className="text-xs font-semibold uppercase tracking-widest hidden md:block">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
