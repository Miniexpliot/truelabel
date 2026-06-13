import React, { useState, useEffect } from 'react';
import { ScanSearch, ShieldCheck, HeartPulse, Clock, ChevronRight } from 'lucide-react';

const HomeView = ({ setActiveTab }) => {
  const facts = [
    "Did you know: 73% of 'healthy' Indian biscuits have more sugar than candy.",
    "Did you know: Maltodextrin spikes your blood sugar 2x faster than table sugar.",
    "Did you know: 'No Added Sugar' often hides fruit concentrates, which are pure fructose.",
    "Did you know: Many brown breads use caramel color (E150) instead of actual whole wheat."
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % facts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-12 pt-8 pb-32 animation-fade-in relative z-10 w-full max-w-3xl mx-auto px-4">
      
      {/* Hero Section - A clean, flowing borderless presentation */}
      <div className="flex flex-col items-center justify-center text-center mt-12 py-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-sm animate-pulse-slow">
          <ScanSearch size={28} className="text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          Uncover the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Brutal Truth</span>
        </h1>
        <p className="text-base md:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
          Scan any packaged food label to instantly reveal hidden sugars, harmful additives, and discover healthy alternative swaps.
        </p>

        {/* Rotating Facts Box - styled as a beautiful single floating glass pill */}
        <div className="mt-8 w-full max-w-lg glass-panel px-6 py-4 flex items-center gap-4 hover:shadow-md transition-all">
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold font-mono">i</span>
          <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed text-left animate-fade-in italic flex-1" key={currentFactIndex}>
            "{facts[currentFactIndex]}"
          </p>
        </div>
      </div>

      {/* Features - Seamless visual list instead of rigid card grids */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-4 px-2">
        <div className="flex-1 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Detect Harmful Additives</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We flag synthetic preservatives, hidden chemical names, and toxic dyes that companies sneak into daily groceries.
            </p>
          </div>
        </div>

        <div className="flex-1 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <HeartPulse size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Get Desi Swaps</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We recommend traditional, healthier alternatives so you can eat well without sacrificing taste or budget.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Actions - borderless text buttons with hover accents */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-4 pt-6 border-t border-slate-900/5">
        <button 
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors group"
        >
          <Clock size={16} />
          <span>Browse Scan History</span>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default HomeView;
