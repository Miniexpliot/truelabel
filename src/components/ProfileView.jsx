import React, { useEffect, useState, useRef } from 'react';
import { User, Shield, Target, Flame, Edit2, Check } from 'lucide-react';

const ProfileView = () => {
  const [stats, setStats] = useState({ totalScans: 0, avgScore: 0, badScans: 0, streak: 0 });
  const [userName, setUserName] = useState("Truth Crusader");
  const [avatar, setAvatar] = useState("🕵️");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const inputRef = useRef(null);

  const avatars = ["🕵️", "🥗", "🧪", "🦸", "🍊", "🔍", "🌾"];

  useEffect(() => {
    const savedHistory = localStorage.getItem('true_label_history');
    const savedStreak = localStorage.getItem('true_label_streak');
    const savedName = localStorage.getItem('true_label_username');
    const savedAvatar = localStorage.getItem('true_label_avatar');
    
    if (savedName) setUserName(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    
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
    if (scans < 5) return "Novice";
    if (scans < 15) return "Label Reader";
    if (scans < 30) return "Inspector";
    return "Label Ninja";
  };

  const handleSaveName = () => {
    if (userName.trim() === "") {
      setUserName("Truth Crusader"); // Fallback
      localStorage.setItem('true_label_username', "Truth Crusader");
    } else {
      localStorage.setItem('true_label_username', userName.trim());
    }
    setIsEditing(false);
  };

  const handleSelectAvatar = (av) => {
    setAvatar(av);
    localStorage.setItem('true_label_avatar', av);
    setShowAvatarPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-4 animation-fade-in">
      <div className="text-center mb-2">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <button 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] border-2 border-cyan-400 text-4xl hover:scale-105 active:scale-95 transition-all"
            aria-label="Change Avatar"
          >
            {avatar}
          </button>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 p-1.5 rounded-full text-slate-400">
            <Edit2 size={12} />
          </div>
        </div>

        {showAvatarPicker && (
          <div className="glass-panel p-3 mb-4 rounded-xl flex justify-center gap-2 max-w-sm mx-auto animate-fade-in">
            {avatars.map((av) => (
              <button
                key={av}
                onClick={() => handleSelectAvatar(av)}
                className={`text-2xl p-1.5 rounded hover:bg-slate-700/50 transition-colors ${avatar === av ? 'bg-cyan-500/20 border border-cyan-400/40' : ''}`}
              >
                {av}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 mb-1">
          {isEditing ? (
            <div className="flex items-center bg-slate-800/50 rounded-lg px-2 border border-slate-600">
              <input 
                ref={inputRef}
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                maxLength={30}
                className="bg-transparent border-none outline-none text-xl font-bold text-white text-center w-56 py-1"
                autoFocus
              />
              <button onClick={handleSaveName} className="text-emerald-400 p-1">
                <Check size={18} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">{userName}</h2>
              <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-cyan-400 transition-colors">
                <Edit2 size={16} />
              </button>
            </>
          )}
        </div>
        
        <p className="text-sm text-cyan-400 mt-1 uppercase tracking-wider font-medium">{getLevel(stats.totalScans)} • Level {Math.min(4, Math.floor(stats.totalScans / 10) + 1)}</p>
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
