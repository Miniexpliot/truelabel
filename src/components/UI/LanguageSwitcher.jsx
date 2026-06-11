// src/components/UI/LanguageSwitcher.jsx
import React, { useEffect } from "react";

/**
 * Simple language selector (English / Hindi). Stores choice in localStorage under "true_label_lang".
 * The app can later use this value for i18n; for now we just toggle the label.
 */
export default function LanguageSwitcher() {
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
  ];

  const getCurrent = () => localStorage.getItem("true_label_lang") || "en";

  useEffect(() => {
    // Apply a data attribute for potential CSS changes
    document.documentElement.setAttribute("data-lang", getCurrent());
  }, []);

  const switchLang = (code) => {
    localStorage.setItem("true_label_lang", code);
    document.documentElement.setAttribute("data-lang", code);
    // Force a reload to apply translations (placeholder behavior)
    window.location.reload();
  };

  const current = getCurrent();

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLang(lang.code)}
          className={`px-2 py-1 rounded text-xs ${current === lang.code ? "bg-cyan-600 text-slate-100" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
          aria-label={`Switch language to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
