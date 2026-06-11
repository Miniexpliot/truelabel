// src/components/LibraryView.jsx
import React, { useEffect, useState } from 'react';
import ResultCard from './UI/ResultCard';

/**
 * Library view displays saved scan history as cards.
 * It reads from localStorage key 'true_label_history'.
 */
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

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 animate-fade-in">
        <h3 className="text-xl font-medium text-slate-200 mb-2">No Saved Scans</h3>
        <p className="text-slate-400 max-w-md text-center">
          Your scanned labels will appear here. Scan a product to start building your library.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 pb-28 animate-fade-in">
      {history.map((item, idx) => (
        <ResultCard
          key={idx}
          title={item.product_name || `Scan #${idx + 1}`}
          score={item.deception_score}
          truth={item.brutal_truth_hinglish}
          ingredients={item.offending_ingredients || []}
          // placeholders for future actions
        />
      ))}
    </div>
  );
}
