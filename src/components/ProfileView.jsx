import React, { useEffect, useState } from 'react';
import { User, Shield, Target, Flame } from 'lucide-react';

const ProfileView = () => {
  const [stats, setStats] = useState({ totalScans: 0, avgScore: 0, badScans: 0, streak: 0 });

  useEffect(() => {
    const savedHistory = localStorage.getItem('true_label_history');
    const savedStreak = localStorage.getItem('true_label_streak');
    
    let totalScans = 0;
    let avgScore = 0;
    let badScans = 0;
    let streak = savedStreak ? parseInt(savedStreak) : 0;

    if (savedHistory) {
      const historyArray = JSON.parse(savedHistory);
      totalScans = historyArray.length;
      if (totalScans > 0) {
        const sumScore = historyArray.reduce((acc, curr) => acc + curr.deception_score, 0);
        avgScore = Math.round(sumScore / totalScans);
        badScans = historyArray.filter(item => item.deception_score > 50).length;
      }
    }
    
    setStats({ totalScans, avgScore, badScans, streak });
  }, []);

  const getLevel = (scans) => {
    if (scans < 5) return "Gullible Buyer";
    if (scans < 15) return "Label Reader";
    if (scans < 30) return "Truth Crusader";
    return "Label Ninja";
  };

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-4 animation-fade-in">
      <div className="text-center mb-2">
        <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] border-2 border-cyan-400">
          <User size={40} className="text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{getLevel(stats.totalScans)}</h2>
        <p className="text-sm text-cyan-400 mt-1 uppercase tracking-wider font-medium">Level {Math.min(4, Math.floor(stats.totalScans / 10) + 1)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
          <Target size={24} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.totalScans}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Scans</div>
        </div>
        
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center">
          <Flame size={24} className="text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-white">{stats.streak}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Day Streak</div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield size={16} /> Exposure Stats
        </h3>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Avg Deception Score</span>
            <span className={stats.avgScore > 50 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{stats.avgScore}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${stats.avgScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${stats.avgScore}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Deceptive Products Found</span>
            <span className="text-orange-400 font-bold">{stats.badScans}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${stats.totalScans > 0 ? (stats.badScans / stats.totalScans) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
