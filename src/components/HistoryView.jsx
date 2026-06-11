import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Trash2 } from 'lucide-react';

const HistoryView = ({ setActiveTab }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('true_label_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved).reverse()); // newest first
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('true_label_history');
    setHistory([]);
  };

  const getMeterColor = (score) => {
    if (score < 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score <= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  if (history.length === 0) {
    return (
      <div role="status" className="flex-1 flex flex-col items-center justify-center -mt-10 animation-fade-in opacity-80">
        <Clock size={48} className="mb-4 text-slate-500" aria-hidden="true" />
        <h3 className="text-xl font-medium text-slate-200">No Scan History</h3>
        <p className="text-sm mt-2 text-center max-w-[220px] text-slate-400 mb-6">
          Your journey to uncover food truths starts here.
        </p>
        <button 
          onClick={() => setActiveTab('scanner')}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
        >
          Start Scanning
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 pb-28 pt-4 animation-fade-in">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-lg font-semibold text-slate-300">Recent Scans</h2>
        <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {history.map((item, idx) => (
        <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col gap-3 animate-slide-up" style={{animationDelay: `${idx * 50}ms`}}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Clock size={12} />
              {new Date(item.timestamp).toLocaleString()}
            </div>
            <div className={`px-2 py-1 rounded-md border text-xs font-bold ${getMeterColor(item.deception_score)}`}>
              {item.deception_score}% Score
            </div>
          </div>
          
          <div className="text-sm text-slate-300 line-clamp-2">
            "{item.brutal_truth_hinglish}"
          </div>

          {item.offending_ingredients && item.offending_ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.offending_ingredients.slice(0, 3).map((ing, i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider text-red-300 bg-red-900/30 px-2 py-0.5 rounded-sm">
                  {ing}
                </span>
              ))}
              {item.offending_ingredients.length > 3 && (
                <span className="text-[10px] text-slate-500">+{item.offending_ingredients.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryView;
