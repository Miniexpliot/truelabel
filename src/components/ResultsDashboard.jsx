import React, { useEffect, useRef, useState } from 'react';
import { Volume2, RefreshCw, AlertTriangle, CheckCircle, Flame, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import Modal from './UI/Modal';

const ResultsDashboard = ({ scanResult, onReset }) => {
  const isGlitch = scanResult.deception_score > 90;
  const snapshotRef = useRef(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const playBeep = () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = isGlitch ? 'sawtooth' : 'triangle';
        oscillator.frequency.setValueAtTime(isGlitch ? 300 : 150, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        console.warn("Audio context failed", e);
      }
    };
    
    playBeep();

    if (scanResult.deception_score < 30) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669', '#ffffff']
      });
    }
  }, [scanResult, isGlitch]);

  const handleIngredientClick = (ing, type) => {
    setSelectedIngredient({
      name: ing.name,
      detail: type === 'harmful' ? ing.fact : ing.benefit,
      type: type
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  const downloadSnapshot = async () => {
    if (!snapshotRef.current) return;
    try {
      const canvas = await html2canvas(snapshotRef.current, { 
        backgroundColor: '#f8fafc',
        scale: 2, 
        useCORS: true
      });
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `${scanResult.product_name || 'Product'}_TrueLabel_Audit.png`;
      a.click();
    } catch (e) {
      console.error('Failed to generate snapshot', e);
    }
  };

  const playAudio = () => {
    if (!scanResult || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scanResult.brutal_truth_hinglish);
    const voices = window.speechSynthesis.getVoices();
    const desiVoice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('en-IN'));
    if (desiVoice) utterance.voice = desiVoice;
    window.speechSynthesis.speak(utterance);
  };

  const getScoreColor = (s) => {
    if (s < 30) return "text-emerald-600";
    if (s <= 70) return "text-amber-600";
    return "text-rose-600";
  };

  const getMeterGradient = (s) => {
    if (s < 30) return "from-emerald-400 to-teal-500";
    if (s <= 70) return "from-amber-400 to-orange-500";
    return "from-rose-500 to-red-600";
  };

  const harmfulList = scanResult.harmful_ingredients || [];
  const goodList = scanResult.good_ingredients || [];

  return (
    <div className={`flex-1 flex flex-col gap-8 pb-32 pt-2 animation-fade-in w-full max-w-2xl mx-auto px-4 ${isGlitch ? 'glitch-shatter' : ''}`}>
      
      {/* Header Info */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-900/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scan Audit Results</span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {scanResult.product_name || "Unknown Product"}
        </h2>

        {/* Premium Score Track */}
        <div className="w-full mt-3">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deception Index</span>
            <span className={`text-xl font-extrabold ${getScoreColor(scanResult.deception_score)}`}>
              {scanResult.deception_score}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950/5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getMeterGradient(scanResult.deception_score)}`}
              style={{ width: `${scanResult.deception_score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Roast & Details Sheet */}
      <div className="glass-panel p-6 flex flex-col gap-6">
        
        {/* Brutal Truth */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Flame size={16} className="text-rose-500" />
              The Brutal Truth
            </h3>
            <button 
              onClick={playAudio}
              className="w-8 h-8 rounded-full bg-slate-950/5 hover:bg-slate-950/10 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Play Audio Roast"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p className="text-slate-800 text-base md:text-lg leading-relaxed italic font-semibold">
            "{scanResult.brutal_truth_hinglish}"
          </p>
        </div>

        {/* Desi Swap (Unified inside the Glass sheet) */}
        {scanResult.desi_swap && (
          <div className="border-t border-slate-900/5 pt-5 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle size={14} /> Recommended Swap
            </h3>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              {scanResult.desi_swap}
            </p>
          </div>
        )}

      </div>

      {/* Ingredients Section - Clean rows instead of cards */}
      <div className="flex flex-col gap-6">
        
        {/* Harmful Ingredients */}
        {harmfulList.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-2">
              <AlertTriangle size={14} /> Red Flags Detected ({harmfulList.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {harmfulList.map((ing, i) => (
                <button
                  key={i}
                  onClick={() => handleIngredientClick(ing, 'harmful')}
                  className="text-xs font-semibold bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 text-rose-700 px-3 py-1.5 rounded-xl transition-all"
                  title="Click to view health risks"
                >
                  ⚠️ {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Good Ingredients */}
        {goodList.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
              <CheckCircle size={14} /> Clean Highlights ({goodList.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {goodList.map((ing, i) => (
                <button
                  key={i}
                  onClick={() => handleIngredientClick(ing, 'good')}
                  className="text-xs font-semibold bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-xl transition-all"
                  title="Click to view nutrition benefits"
                >
                  ✅ {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Infographic Preview & Download action */}
      <div className="flex justify-between items-center py-2">
        <button 
          onClick={downloadSnapshot}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <Share2 size={14} /> Download Shareable Infographic
        </button>
      </div>

      {/* --- HIDDEN SNAPSHOT INFOGRAPHIC CONTAINER FOR IMAGES --- */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div 
          ref={snapshotRef} 
          className="bg-slate-50 p-8 rounded-[2rem] w-[480px] border border-slate-200 shadow-xl flex flex-col gap-6"
        >
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">TRUELABEL AUDIT</span>
              <span className="block text-[8px] text-slate-400 font-mono mt-0.5">VERIFIED AUDIT REPORT</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full">
              <Sparkles size={10} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">AI Audit</span>
            </div>
          </div>

          <div className="text-center bg-white border border-slate-100 p-4 rounded-2xl">
            <h2 className="text-base font-extrabold text-slate-900 tracking-wide truncate">
              {scanResult.product_name || "Packaged Food Item"}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Deception:</span>
              <span className={`text-base font-black ${scanResult.deception_score > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {scanResult.deception_score}%
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-2xl">
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block mb-1">Brutal Truth Roast</span>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{scanResult.brutal_truth_hinglish}"
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {harmfulList.length > 0 && (
              <div className="bg-rose-50/50 border border-rose-100/50 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block mb-2">Red Flags Detected</span>
                <ul className="flex flex-col gap-2">
                  {harmfulList.map((ing, i) => (
                    <li key={i} className="text-[10px] text-slate-700 leading-tight">
                      <strong className="text-slate-900">{ing.name}</strong>: {ing.fact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.desi_swap && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Recommended Swap</span>
                <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
                  {scanResult.desi_swap}
                </p>
              </div>
            )}
          </div>

          <div className="text-center pt-4 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400 font-mono">
            <span>UNCOVER THE BRUTAL TRUTH</span>
            <span>WWW.TRUELABEL.AI</span>
          </div>
        </div>
      </div>

      {/* Sticky Scan Another Item floating action */}
      <div className="fixed bottom-24 left-0 w-full px-4 z-40 pointer-events-none">
        <div className="max-w-xs mx-auto pointer-events-auto">
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              onReset();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          >
            <RefreshCw size={16} />
            Scan Another Item
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIngredient && (
        <Modal
          isOpen={isModalOpen}
          title={selectedIngredient.name}
          onClose={closeModal}
        >
          <div className="flex flex-col gap-3 py-1 text-slate-850">
            <span className={`text-[9px] uppercase font-bold tracking-wider self-start px-2 py-0.5 rounded ${selectedIngredient.type === 'harmful' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {selectedIngredient.type === 'harmful' ? 'Chemical Additive Warning' : 'Nutritional highlight'}
            </span>
            <p className="text-sm leading-relaxed text-slate-700 mt-2 font-medium">
              {selectedIngredient.detail}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ResultsDashboard;
