import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, Trash2, Calendar } from 'lucide-react';

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

  const getStatusColor = (score) => {
    if (score < 30) return 'bg-emerald-500 ring-emerald-500/20';
    if (score <= 70) return 'bg-amber-500 ring-amber-500/20';
    return 'bg-rose-500 ring-rose-500/20';
  };

  const getScoreTextColor = (score) => {
    if (score < 30) return 'text-emerald-600';
    if (score <= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  if (history.length === 0) {
    return (
      <div role="status" className="flex-1 flex flex-col items-center justify-center -mt-10 animation-fade-in opacity-80 py-12">
        <Clock size={48} className="mb-4 text-slate-400" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-slate-900">No Scan History</h3>
        <p className="text-sm mt-2 text-center max-w-[220px] text-slate-500 mb-6 font-medium">
          Your journey to uncover food truths starts here.
        </p>
        <button 
          onClick={() => setActiveTab('home')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          Start Scanning
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-4 animation-fade-in w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center pb-4 border-b border-slate-900/5">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Scans</h2>
          <p className="text-xs text-slate-500 mt-0.5">Timeline of analyzed food products</p>
        </div>
        <button 
          onClick={clearHistory} 
          className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
        >
          <Trash2 size={13} /> Clear All
        </button>
      </div>

      <div className="relative flex flex-col gap-6 pl-4 border-l border-slate-200/60 mt-2">
        {history.map((item, idx) => (
          <div 
            key={idx} 
            className="relative flex flex-col gap-2 animate-slide-up group" 
            style={{animationDelay: `${idx * 60}ms`}}
          >
            {/* Timeline node */}
            <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${getStatusColor(item.deception_score)}`} />
            
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Calendar size={10} />
                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`text-xs font-black uppercase tracking-wider ${getScoreTextColor(item.deception_score)}`}>
                Deception: {item.deception_score}%
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {item.product_name || "Packaged Food Item"}
            </h3>
            
            <p className="text-sm text-slate-600 leading-relaxed italic pr-2">
              "{item.brutal_truth_hinglish}"
            </p>

            {/* Ingredients flag list */}
            {((item.harmful_ingredients && item.harmful_ingredients.length > 0) || (item.offending_ingredients && item.offending_ingredients.length > 0)) && (
              <div className="flex flex-wrap gap-1.5 mt-1 pb-4 border-b border-slate-900/5">
                {(item.harmful_ingredients || item.offending_ingredients.map(name => ({ name }))).slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[9px] uppercase tracking-wider font-bold text-rose-700 bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded-md">
                    {ing.name || ing}
                  </span>
                ))}
                {((item.harmful_ingredients || item.offending_ingredients).length > 3) && (
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest self-center pl-1">
                    +{(item.harmful_ingredients || item.offending_ingredients).length - 3} More
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
