// src/components/NewResultsDashboard.jsx
import React, { useRef, useState } from 'react';
import ResultCard from './UI/ResultCard';
import Modal from './UI/Modal';
import html2canvas from 'html2canvas';
import { RefreshCw, Share2, Download, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * ResultsDashboard displaying the main audit report, detailed modals, 
 * and a side-by-side "Good vs Bad" visual comparison snapshot card.
 */
export default function NewResultsDashboard({ scanResult, onReset }) {
  const roastCardRef = useRef(null);
  const snapshotRef = useRef(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const exportPdf = async () => {
    if (!roastCardRef.current) return;
    const canvas = await html2canvas(roastCardRef.current, { backgroundColor: '#0f172a' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${scanResult.product_name || 'scan'}_report.pdf`);
  };

  // Download the side-by-side infographic snapshot as a high-quality PNG
  const downloadSnapshot = async () => {
    if (!snapshotRef.current) return;
    try {
      // Temporarily expand padding for clean rendering if needed, html2canvas handles it
      const canvas = await html2canvas(snapshotRef.current, { 
        backgroundColor: '#0b1120',
        scale: 2, // High resolution
        useCORS: true
      });
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `${scanResult.product_name || 'Product'}_TrueLabel_Snapshot.png`;
      a.click();
    } catch (e) {
      console.error('Failed to generate infographic snapshot', e);
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

  const harmfulList = scanResult.harmful_ingredients || [];
  const goodList = scanResult.good_ingredients || [];

  return (
    <div className="flex-1 flex flex-col gap-6 pb-32 pt-2 animation-fade-in relative z-10">
      
      {/* Scrollable Container with main card */}
      <div ref={roastCardRef} className="flex flex-col gap-5 p-1 bg-transparent">
        <ResultCard
          title={scanResult.product_name || 'Scan Result'}
          score={scanResult.deception_score}
          truth={scanResult.brutal_truth_hinglish}
          harmfulIngredients={harmfulList}
          goodIngredients={goodList}
          onExport={exportPdf}
          onShare={downloadSnapshot}
          onIngredientClick={handleIngredientClick}
          onPlayAudio={playAudio}
        />
        
        {/* Visual Header for the Snapshot */}
        <div className="flex justify-between items-center px-2 mt-4 glass-panel py-3 px-4 mb-2">
          <h4 className="text-xs uppercase tracking-widest font-bold text-slate-500">Shareable Snapshot</h4>
          <button 
            onClick={downloadSnapshot}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            <Share2 size={13} /> Download Image
          </button>
        </div>

        {/* --- SIDE-BY-SIDE SNAPSHOT INFOGRAPHIC --- */}
        <div 
          ref={snapshotRef} 
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">TRUELABEL AUDIT</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: TL-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <Sparkles size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">AI Certified</span>
            </div>
          </div>

          {/* Product and Score Header */}
          <div className="text-center mb-6 bg-slate-50 border border-slate-100 p-4 rounded-3xl">
            <h2 className="text-lg font-bold text-slate-900 tracking-wide truncate">{scanResult.product_name || "Unknown Product"}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Deception Index:</span>
              <span className={`text-xl font-extrabold ${scanResult.deception_score > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {scanResult.deception_score}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3 max-w-[200px] mx-auto">
              <div 
                className={`h-full ${scanResult.deception_score > 50 ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`} 
                style={{ width: `${scanResult.deception_score}%` }}
              ></div>
            </div>
          </div>

          {/* Side-by-Side Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            
            {/* The Bad Panel (Left) */}
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex flex-col">
              <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-1 border-b border-rose-200 pb-2">
                <ShieldAlert size={14} className="text-rose-600" /> THE BAD
              </h4>
              {harmfulList.length > 0 ? (
                <ul className="flex-1 flex flex-col gap-3">
                  {harmfulList.map((ing, i) => (
                    <li key={i} className="text-[11px] text-slate-700 leading-tight flex items-start gap-1">
                      <span className="text-rose-600 mt-0.5 font-bold">•</span>
                      <div>
                        <strong className="text-slate-900 block font-bold">{ing.name}</strong>
                        <span className="text-slate-600 text-[10px] block mt-0.5">{ing.fact}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 italic flex-1 flex items-center justify-center text-center">
                  No critical harmful ingredients found. Clean audit!
                </p>
              )}
            </div>

            {/* The Good Panel (Right) */}
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1 border-b border-emerald-200 pb-2">
                  <ShieldCheck size={14} className="text-emerald-600" /> THE GOOD
                </h4>
                {goodList.length > 0 ? (
                  <ul className="flex flex-col gap-3 mb-4">
                    {goodList.map((ing, i) => (
                      <li key={i} className="text-[11px] text-slate-700 leading-tight flex items-start gap-1">
                        <span className="text-emerald-600 mt-0.5 font-bold">•</span>
                        <div>
                          <strong className="text-slate-900 block font-bold">{ing.name}</strong>
                          <span className="text-slate-600 text-[10px] block mt-0.5">{ing.benefit}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-500 italic mb-4">
                    No active healthy components identified.
                  </p>
                )}
              </div>

              {/* Desi Swap inside the good column */}
              {scanResult.desi_swap && scanResult.desi_swap !== 'N/A' && (
                <div className="mt-auto bg-emerald-100 border border-emerald-200 p-3 rounded-2xl text-center">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold block mb-0.5">Recommended Swap</span>
                  <p className="text-[10px] text-emerald-900 font-medium leading-tight">{scanResult.desi_swap}</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer Branding */}
          <div className="text-center mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-mono">
            <span>UNCOVER THE BRUTAL TRUTH</span>
            <span>WWW.TRUELABEL.AI</span>
          </div>
        </div>
      </div>

      {/* Scan Another Item Sticky Button */}
      <div className="sticky bottom-4 w-full z-40 pointer-events-none mt-8">
        <div className="max-w-xl mx-auto pointer-events-auto px-4">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onReset();
            }}
            className="w-full glass-panel text-slate-900 hover:bg-slate-50 font-bold py-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <RefreshCw size={18} /> Scan Another Item
          </button>
        </div>
      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <Modal
          isOpen={isModalOpen}
          title={selectedIngredient.name}
          onClose={closeModal}
        >
          <div className="flex flex-col gap-3 py-1 text-slate-300">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${selectedIngredient.type === 'harmful' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {selectedIngredient.type === 'harmful' ? 'Harmful chemical / additive' : 'Clean / nutritional component'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200 mt-2">
              {selectedIngredient.detail}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

