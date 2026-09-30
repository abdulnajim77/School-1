import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = true }) => {
  const { mode, setMode } = useTheme();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl border transition-all ${
        mode === 'dark'
          ? 'bg-slate-900/90 border-slate-800'
          : 'bg-slate-100 border-slate-200'
      } ${className}`}
      role="group"
      aria-label="Theme mode switcher"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setMode('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          mode === 'light'
            ? 'bg-white text-amber-600 shadow-xs border border-slate-200/80'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to Light Mode"
        aria-pressed={mode === 'light'}
      >
        <Sun className="w-3.5 h-3.5 flex-shrink-0" />
        {showLabels && <span>Light</span>}
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setMode('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          mode === 'dark'
            ? 'bg-emerald-700 text-white shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
        title="Switch to Dark Mode"
        aria-pressed={mode === 'dark'}
      >
        <Moon className="w-3.5 h-3.5 flex-shrink-0" />
        {showLabels && <span>Dark</span>}
      </button>
    </div>
  );
};
