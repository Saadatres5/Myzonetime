import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('chronosync-theme');
    return saved ? saved === 'dark' : true;
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chronosync-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  
  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };
  
  return { isDark, toggleDarkMode };
}