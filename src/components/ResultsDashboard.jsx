import React, { useEffect, useRef } from 'react';
import { Volume2, RefreshCw, AlertTriangle, CheckCircle, Flame, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

const ResultsDashboard = ({ scanResult, onReset }) => {
  const roastCardRef = useRef(null);
  const isGlitch = scanResult.deception_score > 90;

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

  const getMeterColor = (score) => {
    if (score < 30) return 'bg-emerald-500';
    if (score <= 70) return 'bg-amber-500';
    return 'bg-red-500';
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

  const shareRoast = async () => {
    if (!roastCardRef.current) return;
    try {
      const canvas = await html2canvas(roastCardRef.current, { backgroundColor: '#0f172a' });
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = "TrueLabel_Roast.png";
      a.click();
    } catch (e) {
      console.error("Failed to generate image", e);
    }
  };

  return (
    <div className={`flex-1 flex flex-col gap-6 pb-32 animation-fade-in ${isGlitch ? 'glitch-shatter' : ''}`}>
      
      {/* Container to be captured by html2canvas */}
      <div ref={roastCardRef} className="flex flex-col gap-6 p-2 -mx-2 bg-transparent">
        
        {/* Deception Meter */}
        <div className="glass-panel p-5 rounded-2xl animate-slide-up">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">Deception Score</span>
            <span className={`text-3xl font-bold drop-shadow-md ${isGlitch ? 'text-red-500 animate-pulse text-glow-cyan' : scanResult.deception_score > 70 ? 'text-red-400' : scanResult.deception_score > 30 ? 'text-amber-400' : 'text-emerald-400 text-glow-emerald'}`}>
              {scanResult.deception_score}%
            </span>
          </div>
          <div className="h-4 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${getMeterColor(scanResult.deception_score)}`}
              style={{ width: `${scanResult.deception_score}%` }}
            ></div>
          </div>
        </div>

        {/* Brutal Truth Card */}
        <div className={`glass-panel p-5 rounded-2xl relative overflow-hidden animate-slide-up ${isGlitch ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''}`} style={{animationDelay: '100ms'}}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <AlertTriangle size={120} className={isGlitch ? "text-red-500" : "text-slate-400"} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className={isGlitch ? "text-red-500 animate-pulse" : "text-red-400"} size={20} />
              The Brutal Truth
            </h3>
            <button 
              onClick={playAudio}
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full text-cyan-400 transition-colors shadow-md active:scale-95"
              aria-label="Play Warning"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10 font-medium">
            "{scanResult.brutal_truth_hinglish}"
          </p>
        </div>

        {/* Offending Ingredients */}
        {scanResult.offending_ingredients && scanResult.offending_ingredients.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl animate-slide-up" style={{animationDelay: '200ms'}}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Red Flags Found</h3>
            <div className="flex flex-wrap gap-2">
              {scanResult.offending_ingredients.map((ing, idx) => (
                <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

      </div> {/* End of Roast Card Ref */}

      <div className="flex gap-4 px-2">
        <button 
          onClick={shareRoast}
          className="flex-1 glass-panel py-3 rounded-xl flex items-center justify-center gap-2 text-cyan-400 font-bold shadow-lg hover:bg-slate-800/80 active:scale-95 transition-all"
        >
          <Share2 size={18} /> Share Roast
        </button>
      </div>

      {/* Desi Swap Card */}
      {scanResult.deception_score >= 30 && (
        <div className="glass-panel bg-emerald-900/10 border-emerald-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden animate-slide-up mx-2" style={{animationDelay: '300ms'}}>
           <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
            <CheckCircle size={80} />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-2 relative z-10 flex items-center gap-2">
            <CheckCircle size={16} />
            Desi Swap
          </h3>
          <p className="text-emerald-50 text-base relative z-10">
            {scanResult.desi_swap}
          </p>
        </div>
      )}

      {/* Scan Again Button */}
      <div className="fixed bottom-20 left-0 w-full px-4 z-40 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              onReset();
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] transition-all active:scale-[0.98]"
          >
            <RefreshCw size={20} />
            Scan Another Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
