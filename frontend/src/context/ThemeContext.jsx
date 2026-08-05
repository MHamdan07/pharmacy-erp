/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const ACCENT_COLOR_MAP = {
  teal: { name: 'Healthcare Teal', bg: 'bg-teal-600', text: 'text-teal-500', hex: '#0d9488' },
  blue: { name: 'Ocean Blue', bg: 'bg-blue-600', text: 'text-blue-500', hex: '#2563eb' },
  emerald: { name: 'Emerald Green', bg: 'bg-emerald-600', text: 'text-emerald-500', hex: '#059669' },
  purple: { name: 'Royal Purple', bg: 'bg-purple-600', text: 'text-purple-500', hex: '#9333ea' },
  rose: { name: 'Crimson Rose', bg: 'bg-rose-600', text: 'text-rose-500', hex: '#e11d48' },
  amber: { name: 'Amber Gold', bg: 'bg-amber-600', text: 'text-amber-500', hex: '#d97706' },
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'teal');

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changeAccent = (color) => {
    if (ACCENT_COLOR_MAP[color]) {
      setAccentColor(color);
    }
  };

  const currentAccent = ACCENT_COLOR_MAP[accentColor] || ACCENT_COLOR_MAP.blue;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleTheme,
        accentColor,
        changeAccent,
        currentAccent,
        availableAccents: ACCENT_COLOR_MAP
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
