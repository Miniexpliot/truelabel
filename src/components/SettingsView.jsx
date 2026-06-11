import React, { useState, useEffect } from 'react';
import { Moon, Type, Leaf, ShieldAlert, Download, Hand } from 'lucide-react';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    dyslexiaFont: false,
    highContrast: false,
    veganMode: false,
    allergyAlerts: false,
    oneHandedMode: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('true_label_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('true_label_settings', JSON.stringify(newSettings));
    
    // Apply Dyslexia font globally
    if (key === 'dyslexiaFont') {
      if (newSettings.dyslexiaFont) {
        document.body.style.fontFamily = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif";
      } else {
        document.body.style.fontFamily = "";
      }
    }
  };

  const downloadCSV = () => {
    const savedHistory = localStorage.getItem('true_label_history');
    if (!savedHistory) return alert("No history to export!");
    
    const data = JSON.parse(savedHistory);
    let csv = "Date,Score,Ingredients,Desi_Swap\n";
    data.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      const ings = item.offending_ingredients ? item.offending_ingredients.join('; ') : '';
      csv += `${date},${item.deception_score},"${ings}","${item.desi_swap}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'true_label_history.csv');
    a.click();
  };

  const Toggle = ({ label, icon: Icon, stateKey, description }) => (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between animate-slide-up mb-3">
      <div className="flex gap-3 items-center">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon size={20} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="font-medium text-slate-200">{label}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`w-12 h-6 rounded-full transition-colors relative ${settings[stateKey] ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings[stateKey] ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col pb-28 pt-4 animation-fade-in">
      <h2 className="text-lg font-semibold text-slate-300 mb-3">Accessibility & Layout</h2>
      <Toggle label="Dyslexia Font" icon={Type} stateKey="dyslexiaFont" description="Easier to read character shapes" />
      <Toggle label="High Contrast" icon={Moon} stateKey="highContrast" description="Maximum readability for low vision" />
      <Toggle label="One-Handed Mode" icon={Hand} stateKey="oneHandedMode" description="Shifts UI down for easy thumb reach" />

      <h2 className="text-lg font-semibold text-slate-300 mb-3 mt-2">Personalization Engine</h2>
      <Toggle label="Vegan Strict Mode" icon={Leaf} stateKey="veganMode" description="Flag all animal by-products aggressively" />
      <Toggle label="Allergy Siren" icon={ShieldAlert} stateKey="allergyAlerts" description="Extra warnings for common allergens" />

      <h2 className="text-lg font-semibold text-slate-300 mb-3 mt-2">Data & Privacy</h2>
      <button 
        onClick={downloadCSV}
        className="glass-panel p-4 rounded-xl flex items-center justify-center gap-2 text-cyan-400 hover:bg-slate-800/80 transition-colors animate-slide-up"
      >
        <Download size={18} /> Export Data to CSV
      </button>
    </div>
  );
};

export default SettingsView;
