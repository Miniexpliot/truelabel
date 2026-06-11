// src/components/UI/ResultCard.jsx
import React from 'react';
import { Share2, Download, Volume2 } from 'lucide-react';

/**
 * Reusable card for displaying scan results or history entries.
 * Props:
 * - title: string – heading of the card (e.g., "Scan Result" or product name)
 * - score: number – deception score (0‑100)
 * - truth: string – brutal truth text
 * - ingredients: array – offending ingredient strings
 * - onExport: function – callback when export button is clicked
 * - onShare: function – callback when share button is clicked
 * - onIngredientClick: function – callback when an ingredient chip is clicked
 * - onPlayAudio: function – callback when play audio button is clicked
 */
export default function ResultCard({
  title = "Scan Result",
  score,
  truth,
  ingredients = [],
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

  return (
    <div className="glass-panel p-5 rounded-xl mb-4 animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}> {score}% </span>
      </div>
      <p className="text-slate-300 mb-3 whitespace-pre-line">{truth}</p>
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {ingredients.map((ing, i) => (
            <button
              key={i}
              onClick={() => onIngredientClick?.(ing)}
              className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded"
            >
              {ing}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            aria-label="Export PDF"
          >
            <Download size={16} aria-hidden="true" /> Export
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            aria-label="Share"
          >
            <Share2 size={16} aria-hidden="true" /> Share
          </button>
        )}
        {onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 ml-auto"
            aria-label="Hear Roast"
          >
            <Volume2 size={16} aria-hidden="true" /> Hear Roast
          </button>
        )}
      </div>
    </div>
  );
}
