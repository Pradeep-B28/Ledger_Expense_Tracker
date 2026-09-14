import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark', name: 'Cyber Dark', primary: '#6366f1', bg: '#0b0f19' },
  { id: 'light', name: 'Crisp Light', primary: '#2563eb', bg: '#f8fafc' },
  { id: 'emerald', name: 'Emerald Mint', primary: '#10b981', bg: '#061a14' },
  { id: 'sunset', name: 'Sunset Rose', primary: '#ec4899', bg: '#180f1e' },
  { id: 'midnight', name: 'Midnight OLED', primary: '#06b6d4', bg: '#000000' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ledger_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('ledger_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    const themeOrder = ['dark', 'light', 'emerald', 'sunset', 'midnight'];
    const currIdx = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currIdx + 1) % themeOrder.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
