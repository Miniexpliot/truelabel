import React, { useState, useEffect } from 'react';
import { ScanLine } from 'lucide-react';

const ProcessingState = () => {
  const [loadingText, setLoadingText] = useState('');

  const loadingPhrases = [
    "Analyzing corporate fluff...",
    "Decoding chemical lies...",
    "Finding hidden sugars...",
    "Consulting local daadi...",
    "Exposing the truth..."
  ];

  useEffect(() => {
    let index = 0;
    setLoadingText(loadingPhrases[0]);
    const interval = setInterval(() => {
      index = (index + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[index]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-10 animation-fade-in">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-radar-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
        <ScanLine size={48} className="text-cyan-400 animate-pulse" />
      </div>
      <h2 className="mt-8 text-xl font-medium text-cyan-300 h-8 text-center transition-all duration-300">
        {loadingText}
      </h2>
    </div>
  );
};

export default ProcessingState;
