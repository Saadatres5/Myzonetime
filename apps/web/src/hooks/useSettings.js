import { useState, useEffect } from 'react';
import { useFavorites } from './useFavorites.js';

const KEY = 'chronos_settings';

const DEFAULTS = {
  is24Hour: false,
  isDark: false,
  defaultLocation: 'Sharjah',
  showSeconds: true,
};

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };   // merge so new keys always exist
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
    if (settings.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting, favorites, toggleFavorite, isFavorite };
}
