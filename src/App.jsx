import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert } from 'lucide-react';
import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import LibraryView from './components/LibraryView';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ProcessingState from './components/ProcessingState';
import ResultsDashboard from './components/ResultsDashboard';


const App = () => {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'history', 'settings', 'library'
  const [appState, setAppState] = useState('idle'); // idle, processing, results, error
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedStreak = localStorage.getItem('true_label_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const showNavbar = activeTab !== 'home' || appState !== 'idle' || scrolled;

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

  const handleMockFallback = (fileObj) => {
    const fileToUse = fileObj || lastUploadedFile;
    setAppState('processing');
    setErrorMessage('');
    setTimeout(() => {
      const filename = fileToUse ? fileToUse.name : "";
      const lowerFile = filename.toLowerCase();
      let mockData;
      
      if (lowerFile.includes("coke") || lowerFile.includes("soda") || lowerFile.includes("juice") || lowerFile.includes("drink") || lowerFile.includes("beverage")) {
        mockData = {
          product_name: "Fizzy Orange Soda",
          deception_score: 85,
          brutal_truth_hinglish: "Although this drink claims 'Fresh Orange & Real Fruit', it is primarily carbonated water sweetened with high-fructose corn syrup, containing very little actual fruit juice. It also uses synthetic artificial food dyes and chemical preservatives.",
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
          brutal_truth_hinglish: "These noodles are highly processed and made from refined wheat flour (maida) and low-grade palm oil. They contain a high concentration of sodium and food flavor enhancers (MSG), which can cause digestion issues if eaten regularly.",
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
          brutal_truth_hinglish: "While labeled 'No Added Sugar' and marketed as a fitness snack, it contains hidden sugars like maltodextrin and artificial sugar alcohols (maltitol) that can cause blood sugar spikes and gastrointestinal discomfort.",
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
          brutal_truth_hinglish: "This product claims 'Zero Cholesterol' but is deep-fried in highly refined palm oil and saturated fats. It also contains excessive sodium content that can strain blood pressure levels.",
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
    }, 1500);
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

    setLastUploadedFile(file);
    setAppState('processing');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/scan`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle Gemini reporting an invalid ingredients label
        if (data.product_name === "Invalid Ingredients Label") {
          setErrorMessage(data.brutal_truth_hinglish || "Oops! Could not read the ingredients list. Please upload a clear photo of the food label.");
          setAppState('error');
          return;
        }

        data = applyAllergyEngine(data);
        setScanResult(data);
        saveToHistoryAndStreak(data);
        setAppState('results');
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.warn("Backend scan failed:", error);
      setErrorMessage(error.message || "Failed to communicate with the server. Please check your connection.");
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setScanResult(null);
    setErrorMessage('');
  };

  return (
    <>
      <div className="w-full h-screen flex mesh-gradient-bg text-slate-800 overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Desktop Sidebar */}
        <div className={`hidden sm:block h-screen shrink-0 z-50 transition-all duration-500 ease-out ${
          showNavbar 
            ? 'opacity-100 translate-x-0 w-20 md:w-64' 
            : 'opacity-0 -translate-x-16 pointer-events-none w-0'
        }`}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (appState === 'results') handleReset();
              setActiveTab(tab);
            }}
            onCapture={handleImageCapture}
          />
        </div>

        {/* Main Content Area */}
        <div 
          onScroll={handleScroll}
          className="flex-1 flex flex-col relative z-0 h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 items-center"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col flex-1 pb-20 sm:pb-8">
            {appState === 'processing' && <ProcessingState />}
            {appState === 'results' && scanResult && (
              <ResultsDashboard scanResult={scanResult} onReset={handleReset} />
            )}
            {appState === 'error' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animation-fade-in gap-4 pb-20">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-2 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-850 uppercase tracking-wider">Scan Failed</h3>
                <p className="text-sm text-slate-600 max-w-[280px] leading-relaxed font-medium">
                  {errorMessage}
                </p>
                
                <div className="flex flex-col gap-2.5 w-full max-w-[240px] mt-4">
                  <button
                    onClick={handleReset}
                    className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                  {lastUploadedFile && (
                    <button
                      onClick={() => handleMockFallback(lastUploadedFile)}
                      className="w-full px-6 py-2.5 bg-transparent hover:bg-slate-100 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-all rounded-xl border border-emerald-500/10"
                    >
                      Use Offline Demo Mode
                    </button>
                  )}
                </div>
              </div>
            )}

            {appState === 'idle' && (
              <>
                {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} onCapture={handleImageCapture} />}
                {activeTab === 'history' && <HistoryView setActiveTab={setActiveTab} />}
                {activeTab === 'settings' && <SettingsView />}
                {activeTab === 'library' && <LibraryView />}
              </>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          show={showNavbar}
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
