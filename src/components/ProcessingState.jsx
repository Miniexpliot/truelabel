import React, { useState, useEffect } from 'react';
import { ScanLine } from 'lucide-react';

const ProcessingState = () => {
  const [loadingText, setLoadingText] = useState('');

  const loadingPhrases = [
    "Initializing digital magnifying glass...",
    "Scanning food package label...",
    "Extracting raw ingredient list...",
    "Detecting category... Snacks/Beverage match found!",
    "Comparing against local Daadi's database...",
    "Exposing corporate ingredient lies...",
    "Calculating deception score...",
    "Drafting a brutal Hinglish roast..."
  ];

  useEffect(() => {
    let index = 0;
    setLoadingText(loadingPhrases[0]);
    const interval = setInterval(() => {
      if (index < loadingPhrases.length - 1) {
        index += 1;
        setLoadingText(loadingPhrases[index]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-10 animation-fade-in relative z-10">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-xl animate-pulse"></div>
        {/* Track border */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
        {/* Spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-radar-spin shadow-[0_0_20px_rgba(16,185,129,0.1)]"></div>
        {/* Scanning grid visualization */}
        <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden">
          <div className="absolute left-0 right-0 h-0.5 bg-emerald-400/80 animate-scan-sweep opacity-50 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <ScanLine size={44} className="text-emerald-500 animate-pulse relative z-10" />
        </div>
      </div>
      <h2 className="mt-10 text-lg font-semibold tracking-wide text-slate-800 min-h-[3rem] text-center px-4 transition-all duration-300">
        {loadingText}
      </h2>
      <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-1">Please do not close this screen</p>
    </div>
  );
};

export default ProcessingState;

