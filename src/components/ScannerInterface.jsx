import React from 'react';
import { Camera } from 'lucide-react';

/**
 * ScannerInterface rendering a screen-filling camera viewfinder.
 * The big center camera button is now a visual centerpiece,
 * and the actual file capture is triggered from the bottom nav bar.
 */
const ScannerInterface = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center animation-fade-in scanner-grid overflow-hidden z-10 pb-20">
      
      {/* Laser Scanning Line */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan-sweep pointer-events-none"></div>

      {/* Corner Viewfinder Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-lg pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-lg pointer-events-none"></div>
      <div className="absolute bottom-28 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-lg pointer-events-none"></div>
      <div className="absolute bottom-28 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-lg pointer-events-none"></div>

      {/* Visual Centerpiece Graphic */}
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-10 animate-pulse-slow"></div>
        <div className="relative w-40 h-40 rounded-full border border-emerald-400/30 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm shadow-[inset_0_4px_20px_rgba(16,185,129,0.1)] overflow-hidden">
          <Camera size={48} className="text-emerald-500/50" aria-hidden="true" />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-wider text-emerald-400 uppercase drop-shadow-md">Scanner Active</h2>
      <p className="mt-2 text-slate-400 text-center max-w-[280px] text-sm font-light">
        Tap the <strong className="text-emerald-400">bottom camera icon</strong> in the nav bar to scan a food label.
      </p>
    </div>
  );
};

export default ScannerInterface;
