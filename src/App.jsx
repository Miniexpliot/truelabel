import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import ScannerInterface from './components/ScannerInterface';
import ProcessingState from './components/ProcessingState';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import LeaderboardView from './components/LeaderboardView';
import Navbar from './components/Navbar';

const App = () => {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner', 'history', 'settings', 'profile', 'leaderboard'
  const [appState, setAppState] = useState('idle'); // idle, processing, results
  const [scanResult, setScanResult] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem('true_label_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const saveToHistoryAndStreak = (result) => {
    try {
      const saved = localStorage.getItem('true_label_history');
      let historyArray = saved ? JSON.parse(saved) : [];
      historyArray.push({
        ...result,
        timestamp: new Date().toISOString()
      });
      if (historyArray.length > 50) historyArray.shift();
      localStorage.setItem('true_label_history', JSON.stringify(historyArray));

      const lastScanDateStr = localStorage.getItem('true_label_last_scan_date');
      const todayStr = new Date().toDateString();
      
      let currentStreak = streak;
      if (lastScanDateStr !== todayStr) {
        if (lastScanDateStr) {
          const lastDate = new Date(lastScanDateStr);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate.toDateString() === yesterday.toDateString()) currentStreak += 1;
          else currentStreak = 1;
        } else {
          currentStreak = 1;
        }
        setStreak(currentStreak);
        localStorage.setItem('true_label_streak', currentStreak.toString());
        localStorage.setItem('true_label_last_scan_date', todayStr);
      }
    } catch (e) {
      console.warn("Local storage save failed", e);
    }
  };

  const applyAllergyEngine = (data) => {
    const savedSettings = localStorage.getItem('true_label_settings');
    if (!savedSettings) return data;
    
    const settings = JSON.parse(savedSettings);
    
    // Diet Violation Check (Mock Logic)
    if (settings.veganMode) {
      // Force a violation if not already bad
      data.deception_score = 100;
      data.brutal_truth_hinglish = "🚨 VEGAN VIOLATION: Gelatin and Milk Solids detected! Yeh product '100% Veg' claim karta hai, par isme animal products hain!";
      data.offending_ingredients = ["Gelatin (Animal Derived)", "Milk Solids", ...data.offending_ingredients];
    }
    
    return data;
  };

  const handleImageCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Security & Hardening: Validate file type and size before processing
    if (!file.type.startsWith('image/')) {
      alert("Security Alert: Invalid file type. Please upload an image.");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert("Security Alert: File is too large (max 10MB).");
      return;
    }

    setAppState('processing');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        let data = await response.json();
        data = applyAllergyEngine(data);
        setScanResult(data);
        saveToHistoryAndStreak(data);
        setAppState('results');
        return;
      }
    } catch (error) {
      console.warn("Backend fetch failed. Using mock data.");
    }

    // Mock response fallback
    setTimeout(() => {
      // Create random mock scenarios (10% clean, 10% extreme glitch, 80% bad)
      const rand = Math.random();
      let mockData;
      
      if (rand < 0.1) {
        mockData = {
          deception_score: 15,
          brutal_truth_hinglish: "Bhai wah! Isme sach mein aam hai aur cheeni bhi kam hai. Good choice, isko bindass peeyo.",
          offending_ingredients: [],
          desi_swap: "N/A"
        };
      } else if (rand > 0.9) {
        mockData = {
          deception_score: 95,
          brutal_truth_hinglish: "SCAM ALERT! Yeh poora nakli item hai. 1% fruit pulp aur 99% factory waste. Turant dustbin mein dalo!",
          offending_ingredients: ["Titanium Dioxide", "High Fructose Corn Syrup", "Maltodextrin", "Polysorbate 80"],
          desi_swap: "Fresh Nimbu Pani ya homemade Mosambi Juice."
        };
      } else {
        mockData = {
          deception_score: 75,
          brutal_truth_hinglish: "Bhai, isme 'Real Juice' ke naam pe sirf chini aur artificial flavors bhare hain.",
          offending_ingredients: ["High Fructose Corn Syrup", "Artificial Colors (Red 40)"],
          desi_swap: "Fresh Nimbu Pani."
        };
      }

      mockData = applyAllergyEngine(mockData);
      setScanResult(mockData);
      saveToHistoryAndStreak(mockData);
      setAppState('results');
    }, 3000);
  };

  const handleReset = () => {
    setAppState('idle');
    setScanResult(null);
  };

  return (
    <>
      {/* Background Animated Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-transparent text-slate-200 overflow-y-auto overflow-x-hidden p-6 relative z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center py-6 pt-8 mb-4 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-[length:200%_auto] animate-[pulse_3s_ease-in-out_infinite] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            True Label
          </h1>
          <p className="text-slate-300 text-sm tracking-[0.3em] uppercase mt-2 font-medium">Exposed</p>
          
          {/* Streak Counter */}
          {streak > 0 && (
            <div className="absolute top-8 right-0 flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700 shadow-[0_0_15px_rgba(249,115,22,0.2)] animate-pulse-slow">
              <span className="text-sm font-bold text-orange-400">{streak}</span>
              <Flame size={16} className="text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-0">
          {activeTab === 'scanner' && (
            <>
              {appState === 'idle' && <ScannerInterface onCapture={handleImageCapture} />}
              {appState === 'processing' && <ProcessingState />}
              {appState === 'results' && scanResult && (
                <ResultsDashboard scanResult={scanResult} onReset={handleReset} />
              )}
            </>
          )}

          {activeTab === 'history' && <HistoryView setActiveTab={setActiveTab} />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
        </div>

        {/* Global Bottom Navigation */}
        {(appState !== 'results' || activeTab !== 'scanner') && (
          <Navbar activeTab={activeTab} setActiveTab={(tab) => {
            if (appState === 'results') handleReset();
            setActiveTab(tab);
          }} />
        )}

      </div>
    </>
  );
};

export default App;
