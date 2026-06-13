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
    if (s < 30) return "text-emerald-700";
    if (s <= 70) return "text-amber-700";
    return "text-orange-800";
  };

  const getScoreBg = (s) => {
    if (s < 30) return "bg-emerald-50/60";
    if (s <= 70) return "bg-amber-50/60";
    return "bg-orange-50/60";
  };

  // Convert legacy list if new list is empty
  const activeHarmful = harmfulIngredients.length > 0 
    ? harmfulIngredients 
    : (ingredients || []).map(ing => typeof ing === 'string' ? { name: ing, fact: "Marketing claim mismatch or harmful industrial additive." } : ing);

  return (
    <div className={`p-6 rounded-3xl mb-4 transition-all duration-300 animate-slide-up ${getScoreBg(score)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">Analysis Report</span>
          <h3 className="text-xl font-bold text-stone-800 mt-0.5">{title}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(score)}`}>{score}%</span>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 mt-1">Deception Index</span>
        </div>
      </div>

      {/* Hinglish Roast Text */}
      <div className="bg-stone-50/80 rounded-2xl mb-5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-5 py-4">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600/60"></div>
        <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-line italic">"{truth}"</p>
      </div>

      {/* Harmful Ingredients Section */}
      {activeHarmful.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-800 mb-2.5 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-orange-800 animate-pulse" />
            Harmful Ingredients ({activeHarmful.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeHarmful.map((ing, i) => (
              <button
                key={i}
                onClick={() => onIngredientClick?.(ing, 'harmful')}
                className="text-xs bg-orange-200/40 text-orange-900 hover:bg-orange-200/60 px-3 py-1.5 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1"
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            Clean / OK Ingredients ({goodIngredients.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {goodIngredients.map((ing, i) => (
              <button
                key={i}
                onClick={() => onIngredientClick?.(ing, 'good')}
                className="text-xs bg-emerald-200/40 text-emerald-900 hover:bg-emerald-200/60 px-3 py-1.5 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1"
                title="Click for nutrition benefits"
              >
                <span>✅</span> {ing.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-stone-200/50">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors"
            aria-label="Export PDF Report"
          >
            <Download size={15} aria-hidden="true" /> Export Report
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors"
            aria-label="Share Image"
          >
            <Share2 size={15} aria-hidden="true" /> Download Snapshot
          </button>
        )}
        {onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors ml-auto"
            aria-label="Hear Roast"
          >
            <Volume2 size={15} aria-hidden="true" /> Hear Roast
          </button>
        )}
      </div>
    </div>
  );
}

