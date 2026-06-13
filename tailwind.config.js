/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'radar-spin': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-sweep': 'scanSweep 2s ease-in-out infinite',
      },
      keyframes: {
        scanSweep: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        }
      },
      colors: {
        dark: {
          bg: '#0f172a', // slate-900
          surface: '#1e293b', // slate-800
          border: '#334155', // slate-700
        }
      }
    },
  },
  plugins: [],
}
