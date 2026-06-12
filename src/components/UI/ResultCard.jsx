// src/components/UI/ResultCard.jsx
import React from 'react';
import { Share2, Download, Volume2, ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * Reusable card for displaying scan results or history entries.
 * Handles both new categorised ingredients object structure and legacy string arrays.
 */
export default function ResultCard({
  title = "Scan Result",
  score,
  truth,
  ingredients = [],
  harmfulIngredients = [],
  goodIngredients = [],
  onExport,
  onShare,
  onIngredientClick,
  onPlayAudio,
}) {
  const getScoreColor = (s) => {
    if (s < 30) return "text-emerald-400";
    if (s <= 70) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (s) => {
    if (s < 30) return "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
    if (s <= 70) return "bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
    return "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
  };

  // Convert legacy list if new list is empty
  const activeHarmful = harmfulIngredients.length > 0 
    ? harmfulIngredients 
    : (ingredients || []).map(ing => typeof ing === 'string' ? { name: ing, fact: "Marketing claim mismatch or harmful industrial additive." } : ing);

  return (
    <div className={`glass-panel p-6 rounded-2xl mb-4 border transition-all duration-300 animate-slide-up ${getScoreBg(score)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Analysis Report</span>
          <h3 className="text-xl font-bold text-white mt-0.5">{title}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(score)}`}>{score}%</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Deception Index</span>
        </div>
      </div>

      {/* Hinglish Roast Text */}
      <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line italic">"{truth}"</p>
      </div>

      {/* Harmful Ingredients Section */}
      {activeHarmful.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2.5 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-red-400 animate-pulse" />
            Harmful Ingredients ({activeHarmful.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeHarmful.map((ing, i) => (
              <button
                key={i}
                onClick={() => onIngredientClick?.(ing, 'harmful')}
                className="text-xs bg-red-950/20 text-red-400 hover:bg-red-900/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1"
                title="Click for health risks"
              >
                <span>⚠️</span> {ing.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Good/OK Ingredients Section */}
      {goodIngredients.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Clean / OK Ingredients ({goodIngredients.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {goodIngredients.map((ing, i) => (
              <button
                key={i}
                onClick={() => onIngredientClick?.(ing, 'good')}
                className="text-xs bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1"
                title="Click for nutrition benefits"
              >
                <span>✅</span> {ing.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-3 border-t border-slate-800/80">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            aria-label="Export PDF Report"
          >
            <Download size={15} aria-hidden="true" /> Export Report
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            aria-label="Share Image"
          >
            <Share2 size={15} aria-hidden="true" /> Download Snapshot
          </button>
        )}
        {onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors ml-auto hover:glow"
            aria-label="Hear Roast"
          >
            <Volume2 size={15} aria-hidden="true" /> Hear Roast
          </button>
        )}
      </div>
    </div>
  );
}

