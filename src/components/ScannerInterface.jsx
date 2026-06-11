import React, { useState, useEffect } from 'react';
import { Camera, Lightbulb } from 'lucide-react';

const ScannerInterface = ({ onCapture }) => {
  const [dailyFact, setDailyFact] = useState("");

  const facts = [
    "Maltodextrin spikes blood sugar faster than actual table sugar.",
    "Red 40 is derived from petroleum and linked to hyperactivity.",
    "'Natural Flavors' can legally contain up to 100 different synthetic chemicals.",
    "Palm oil harvesting causes mass deforestation and is often hidden as 'vegetable oil'."
  ];

  useEffect(() => {
    // Pick a daily fact based on day of year to keep it consistent per day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setDailyFact(facts[dayOfYear % facts.length]);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-10 animation-fade-in relative z-10">
      
      {/* Ingredient of the Day Widget */}
      <div className="absolute top-0 w-full glass-panel p-3 rounded-xl flex items-start gap-3 opacity-90 animate-slide-up">
        <div className="bg-amber-500/20 p-2 rounded-lg">
          <Lightbulb size={18} className="text-amber-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">Did you know?</h4>
          <p className="text-xs text-slate-300 leading-tight">{dailyFact}</p>
        </div>
      </div>

      <div className="relative group cursor-pointer mt-16">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse-slow transition-opacity duration-500"></div>
        <div className="relative w-48 h-48 rounded-full border border-emerald-400/50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md shadow-[inset_0_4px_30px_rgba(16,185,129,0.3),_0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-pulse-slow">
          <Camera size={64} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={onCapture}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            aria-label="Scan food label"
          />
        </div>
      </div>
      <h2 className="mt-8 text-xl font-medium text-slate-300 drop-shadow-md">Tap to Scan Label</h2>
      <p className="mt-2 text-slate-400 text-center max-w-[250px] text-sm font-light">
        Uncover the brutal truth behind packaged food.
      </p>
    </div>
  );
};

export default ScannerInterface;
