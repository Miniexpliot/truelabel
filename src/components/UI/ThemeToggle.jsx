// src/components/UI/ThemeToggle.jsx
import React, { useEffect } from "react";

/**
 * Simple dark/light theme toggle.
 * Stores the chosen theme in localStorage under "true_label_theme".
 * The root <html> element receives a class "dark" for dark mode.
 */
export default function ThemeToggle() {
  // Initialize theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("true_label_theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // default to dark
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("true_label_theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("true_label_theme", "dark");
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
