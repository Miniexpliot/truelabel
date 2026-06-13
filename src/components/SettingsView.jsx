import React, { useState, useEffect } from 'react';
import { Moon, Type, Leaf, ShieldAlert, Download } from 'lucide-react';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    dyslexiaFont: false,
    highContrast: false,
    veganMode: false,
    allergyAlerts: false
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

  const ToggleRow = ({ label, icon: Icon, stateKey, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <div className="p-2 bg-slate-950/5 rounded-xl text-emerald-600">
          <Icon size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{label}</h4>
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`w-10 h-5 rounded-full transition-colors relative ${settings[stateKey] ? 'bg-emerald-500' : 'bg-slate-350'}`}
        aria-label={`Toggle ${label}`}
      >
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${settings[stateKey] ? 'left-[22px]' : 'left-[4px]'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col pb-28 pt-4 animation-fade-in px-2 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Customize analysis filters & preferences</p>
      </div>

      <div className="glass-panel p-6 flex flex-col gap-6">
        
        {/* Accessibility & Layout */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Accessibility & Layout</h3>
          <div className="flex flex-col gap-4">
            <ToggleRow label="Dyslexia Font" icon={Type} stateKey="dyslexiaFont" description="Easier to read character shapes" />
            <div className="h-px bg-slate-900/5"></div>
            <ToggleRow label="High Contrast" icon={Moon} stateKey="highContrast" description="Maximum readability for low vision" />
          </div>
        </div>

        <div className="h-px bg-slate-900/5"></div>

        {/* Personalization Engine */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personalization Engine</h3>
          <div className="flex flex-col gap-4">
            <ToggleRow label="Vegan Strict Mode" icon={Leaf} stateKey="veganMode" description="Flag all animal by-products aggressively" />
            <div className="h-px bg-slate-900/5"></div>
            <ToggleRow label="Allergy Siren" icon={ShieldAlert} stateKey="allergyAlerts" description="Extra warnings for common allergens" />
          </div>
        </div>

        <div className="h-px bg-slate-900/5"></div>

        {/* Data & Export */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Data & Privacy</h3>
          <button 
            onClick={downloadCSV}
            className="w-full mt-2 py-3 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 font-bold transition-all text-xs flex items-center justify-center gap-2"
          >
            <Download size={14} /> Export Scan History to CSV
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
