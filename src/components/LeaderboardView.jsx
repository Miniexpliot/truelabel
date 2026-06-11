import React from 'react';
import { Trophy, AlertOctagon, TrendingUp } from 'lucide-react';

const LeaderboardView = () => {
  // Mock data for the Hall of Shame
  const hallOfShame = [
    { rank: 1, brand: "Fake 'Real' Juice", score: 98, ingredient: "High Fructose Corn Syrup", scans: 1420 },
    { rank: 2, brand: "Kids 'Healthy' Cereal", score: 95, ingredient: "Maltodextrin", scans: 1105 },
    { rank: 3, brand: "Diet 'Zero' Cola", score: 92, ingredient: "Aspartame", scans: 980 },
    { rank: 4, brand: "Protein 'Max' Bar", score: 88, ingredient: "Soy Protein Isolate", scans: 740 },
    { rank: 5, brand: "Organic Veggie Chips", score: 85, ingredient: "Palm Oil", scans: 610 }
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 pb-28 pt-4 animation-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-red-400 flex items-center justify-center gap-2">
          <AlertOctagon /> Hall of Shame
        </h2>
        <p className="text-sm text-slate-400 mt-1">Most deceptive products scanned today</p>
      </div>

      <div className="glass-panel p-4 rounded-xl flex flex-col gap-4">
        {hallOfShame.map((item) => (
          <div key={item.rank} className="flex items-center gap-4 border-b border-slate-700/50 pb-3 last:border-0 last:pb-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${item.rank === 1 ? 'bg-yellow-500 text-yellow-900' : item.rank === 2 ? 'bg-slate-300 text-slate-800' : item.rank === 3 ? 'bg-orange-400 text-orange-900' : 'bg-slate-800 text-slate-400'}`}>
              #{item.rank}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-200 text-sm">{item.brand}</h3>
              <p className="text-xs text-red-400">{item.ingredient}</p>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-black text-red-500 drop-shadow-sm">{item.score}%</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                <TrendingUp size={10} /> {item.scans}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardView;
