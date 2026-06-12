import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import ScannerInterface from './components/ScannerInterface';
import ProcessingState from './components/ProcessingState';
import ResultsDashboard from './components/NewResultsDashboard';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import LeaderboardView from './components/LeaderboardView';
import LibraryView from './components/LibraryView';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

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
      
      // Ensure offending_ingredients exists as strings for backward compatibility
      const offending = result.offending_ingredients || 
        (result.harmful_ingredients ? result.harmful_ingredients.map(i => i.name) : []);

      historyArray.push({
        ...result,
        offending_ingredients: offending,
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
      data.deception_score = 100;
      data.brutal_truth_hinglish = "🚨 VEGAN VIOLATION: Gelatin and Milk Solids detected! This product claims '100% Veg' but contains animal ingredients.";
      
      // Prepend the vegan violations as objects
      data.harmful_ingredients = [
        { name: "Gelatin (Animal Derived)", fact: "Derived from animal collagen, violating strict vegan guidelines." },
        { name: "Milk Solids", fact: "Dairy component, violating dairy-free or strictly vegan requirements." },
        ...(data.harmful_ingredients || [])
      ];
      data.offending_ingredients = data.harmful_ingredients.map(i => i.name);
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
      const filename = file.name || "";
      const lowerFile = filename.toLowerCase();
      let mockData;
      
      if (lowerFile.includes("coke") || lowerFile.includes("soda") || lowerFile.includes("juice") || lowerFile.includes("drink") || lowerFile.includes("beverage")) {
        mockData = {
          product_name: "Fizzy Orange Soda",
          deception_score: 85,
          brutal_truth_hinglish: "Bhai, label pe likha hai 'Fresh Orange & Real Fruit' par asal mein yeh bas high fructose syrup aur carbonated paani hai. 100% scam chal raha hai!",
          harmful_ingredients: [
            {
              name: "High Fructose Corn Syrup",
              fact: "Spikes insulin and blood sugar instantly, contributing directly to fatty liver disease."
            },
            {
              name: "Sunset Yellow (FCF)",
              fact: "Derived from petroleum chemicals; linked to hyperactivity in children and banned in several countries."
            },
            {
              name: "Sodium Preservatives",
              fact: "Can react with vitamin C to produce benzene, a known carcinogen."
            }
          ],
          good_ingredients: [
            {
              name: "Purified Carbonated Water",
              benefit: "Provides basic hydration, but the high sugar content completely overrides any health benefits."
            }
          ],
          desi_swap: "Fresh Orange Juice (no sugar added) or traditional Nimbu Shanjivi."
        };
      } else if (lowerFile.includes("noodles") || lowerFile.includes("maggie") || lowerFile.includes("ramen") || lowerFile.includes("instant")) {
        mockData = {
          product_name: "Instant Masala Noodles",
          deception_score: 90,
          brutal_truth_hinglish: "Sirf 2 minute mein tayaar hone wali bimari! Maida, palm oil aur heavy sodium ka combo jo aapke liver aur gut ko direct damage karta hai.",
          harmful_ingredients: [
            {
              name: "Refined Wheat Flour (Maida)",
              fact: "Stripped of fiber, digests slowly, and can cause digestive issues or sluggishness."
            },
            {
              name: "Refined Palm Oil",
              fact: "Highly processed saturated fat that increases bad cholesterol and arterial clogging risks."
            },
            {
              name: "Monosodium Glutamate (MSG)",
              fact: "Triggers intense flavor signals that encourage overeating, leading to a sodium crash."
            }
          ],
          good_ingredients: [
            {
              name: "Spices Blend (Turmeric, Garlic)",
              benefit: "Contains small natural anti-inflammatory antioxidants, though drowned in sodium."
            }
          ],
          desi_swap: "Homemade Veg Vermicelli (Sewai) cooked with mustard seeds, curry leaves, and fresh peas."
        };
      } else if (lowerFile.includes("bar") || lowerFile.includes("cookie") || lowerFile.includes("protein") || lowerFile.includes("health")) {
        mockData = {
          product_name: "Healthy Oats Protein Bar",
          deception_score: 55,
          brutal_truth_hinglish: "Health ke naam pe mithaas! Labeled 'No Added Sugar' par peeche Maltodextrin aur liquid glucose/maltitol syrup chhupa rakha hai.",
          harmful_ingredients: [
            {
              name: "Maltodextrin",
              fact: "Has a higher glycemic index than white sugar, causing rapid blood sugar spikes."
            },
            {
              name: "Artificial Sweeteners (Maltitol)",
              fact: "Low-calorie sugar alcohol that can cause bloating and digestive discomfort."
            }
          ],
          good_ingredients: [
            {
              name: "Rolled Oats",
              benefit: "Rich in beta-glucan soluble fiber, supporting cardiovascular health and cholesterol management."
            },
            {
              name: "Almonds & Seeds",
              benefit: "Provides trace minerals like zinc, magnesium, and healthy monounsaturated fatty acids."
            }
          ],
          desi_swap: "Roasted Makhana (Fox Nuts) with a pinch of black pepper, or simple roasted dry chana."
        };
      } else {
        // General category fallback
        mockData = {
          product_name: "Crispy Potato Namkeen Chips",
          deception_score: 75,
          brutal_truth_hinglish: "Zero Cholesterol likh ke bech rahe hain, par refined palm oil mein deep fry kiya hua hai. Aise cholesterol kam nahi hota, dosto!",
          harmful_ingredients: [
            {
              name: "Refined Vegetable Palm Oil",
              fact: "Highly processed, saturated fat that raises LDL ('bad') cholesterol."
            },
            {
              name: "Excessive Sodium Chloride",
              fact: "High salt levels contribute to elevated blood pressure and strain the kidneys."
            }
          ],
          good_ingredients: [
            {
              name: "Potato Starch / Besan",
              benefit: "Provides clean energy source, though cooking method ruins its nutritional value."
            }
          ],
          desi_swap: "Homemade roasted puffed rice (Kurmura) mix or dry-roasted masala peanuts."
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-0">
          {activeTab === 'scanner' && (
            <>
              {appState === 'idle' && <ScannerInterface />}
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
          {activeTab === 'library' && <LibraryView />}
        </div>

        {/* Global Bottom Navigation - desktop */}
        <div className="hidden sm:block">
          <Navbar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (appState === 'results') handleReset();
              setActiveTab(tab);
            }}
            onCapture={handleImageCapture}
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (appState === 'results') handleReset();
            setActiveTab(tab);
          }}
          onCapture={handleImageCapture}
        />

      </div>
    </>
  );
};

export default App;
