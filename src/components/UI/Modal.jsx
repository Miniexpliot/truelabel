// src/components/UI/Modal.jsx
import React from "react";

/**
 * Generic modal component.
 * Props:
 *  - isOpen: boolean – whether modal is visible
 *  - title: string – modal header
 *  - children: node – content inside modal
 *  - onClose: function – callback to close modal
 */
export default function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-panel rounded-xl p-6 w-full max-w-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-bold text-slate-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-800">{children}</div>
      </div>
    </div>
  );
}
