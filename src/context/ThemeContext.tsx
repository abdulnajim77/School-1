import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = 'schoolsync_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_MODE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // fallback
    }
    // Default to dark mode as requested by user
    return 'dark';
  });

  const applyModeToDOM = (currentMode: ThemeMode) => {
    const root = document.documentElement;
    const body = document.body;

    if (currentMode === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
      body.style.backgroundColor = '#0B0F19';
      body.style.color = '#F1F5F9';

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#0B0F19');
      }
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.setAttribute('data-theme', 'light');
      body.style.backgroundColor = '#F8FAFC';
      body.style.color = '#0F172A';

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#064E3B');
      }
    }
  };

  useEffect(() => {
    applyModeToDOM(mode);
    try {
      localStorage.setItem(THEME_MODE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isDark: mode === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
