// src/components/LibraryView.jsx
import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

export default function LibraryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('true_label_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).reverse(); // newest first
        setHistory(parsed);
      } catch (e) {
        console.warn('Failed to parse library history', e);
      }
    }
  }, []);

  const getScoreColor = (s) => {
    if (s < 30) return "text-emerald-600";
    if (s <= 70) return "text-amber-600";
    return "text-rose-600";
  };

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 animate-fade-in opacity-80">
        <h3 className="text-xl font-medium text-slate-900 mb-2">No Saved Scans</h3>
        <p className="text-slate-500 max-w-sm text-center text-sm font-medium">
          Your scanned food products will appear here. Scan a product to start building your library.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-4 animate-fade-in w-full max-w-2xl mx-auto px-4">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Saved Audits</h2>
        <p className="text-xs text-slate-500 mt-0.5">Your catalog of audited food items</p>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/30 backdrop-blur-sm hover:bg-white/60 transition-all hover:scale-[1.01]"
          >
            <div className="flex flex-col gap-1 min-w-0 pr-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} />
                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {item.product_name || "Food Product"}
              </h3>
              <p className="text-xs text-slate-500 truncate italic">
                "{item.brutal_truth_hinglish}"
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className={`block text-sm font-black ${getScoreColor(item.deception_score)}`}>
                  {item.deception_score}%
                </span>
                <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">Deception</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
