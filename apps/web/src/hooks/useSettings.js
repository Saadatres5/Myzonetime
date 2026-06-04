import { useState, useEffect } from 'react';
import { useFavorites } from './useFavorites.js';

const KEY = 'chronos_settings';

const DEFAULTS = {
  is24Hour: false,
  isDark: false,
  theme: 'dark',
  defaultLocation: 'Sharjah',
  showSeconds: true,
};

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    const settings = { ...DEFAULTS, ...parsed };
    if (!settings.theme) {
      settings.theme = settings.isDark ? 'dark' : 'light';
    }
    return settings;
  } catch {
    return DEFAULTS;
  }
}

function safeWrite(value) {
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* ignore */ }
}

export function useSettings() {
  const [settings, setSettings] = useState(safeRead);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    safeWrite(settings);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-ocean', 'dark');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.add('theme-light');
    } else if (settings.theme === 'ocean') {
      root.classList.add('theme-ocean');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting, favorites, toggleFavorite, isFavorite };
}
