// src/components/NewResultsDashboard.jsx
import React, { useRef, useState } from 'react';
import ResultCard from './UI/ResultCard';
import Modal from './UI/Modal';
import html2canvas from 'html2canvas';
import { RefreshCw } from 'lucide-react';

/**
 * New ResultsDashboard that uses reusable ResultCard and ingredient modal.
 */
export default function NewResultsDashboard({ scanResult, onReset }) {
  const roastCardRef = useRef(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIngredientClick = (ing) => {
    setSelectedIngredient(ing);
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

  // Simple audio playback (same as before)
  const playAudio = () => {
    if (!scanResult || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scanResult.brutal_truth_hinglish);
    const voices = window.speechSynthesis.getVoices();
    const desiVoice = voices.find(v => v.lang.includes('hi-IN') || v.lang.includes('en-IN'));
    if (desiVoice) utterance.voice = desiVoice;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 pb-32 animation-fade-in">
      <div ref={roastCardRef} className="flex flex-col gap-6 p-2 -mx-2 bg-transparent">
        <ResultCard
          title={scanResult.product_name || 'Scan Result'}
          score={scanResult.deception_score}
          truth={scanResult.brutal_truth_hinglish}
          ingredients={scanResult.offending_ingredients || []}
          onExport={exportPdf}
          onShare={() => {
            // reuse existing share logic
            const shareRoast = async () => {
              if (!roastCardRef.current) return;
              try {
                const canvas = await html2canvas(roastCardRef.current, { backgroundColor: '#0f172a' });
                const image = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = image;
                a.download = 'TrueLabel_Roast.png';
                a.click();
              } catch (e) {
                console.error('Failed to generate image', e);
              }
            };
            shareRoast();
          }}
          onIngredientClick={handleIngredientClick}
        />
        {scanResult.deception_score >= 30 && (
          <div className="glass-panel bg-emerald-900/10 border-emerald-500/30 p-5 rounded-2xl shadow-lg relative overflow-hidden animate-slide-up mx-2" style={{ animationDelay: '300ms' }}>
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
              {/* placeholder icon */}
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-2 relative z-10 flex items-center gap-2">
              Desi Swap
            </h3>
            <p className="text-emerald-50 text-base relative z-10">{scanResult.desi_swap}</p>
          </div>
        )}
      </div>

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
            <RefreshCw size={20} /> Scan Another Item
          </button>
        </div>
      </div>

      {/* Ingredient Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        title={selectedIngredient}
        onClose={closeModal}
      >
        <p>Placeholder information about <strong>{selectedIngredient}</strong>. Add health facts or alternatives here.</p>
      </Modal>
    </div>
  );
}
