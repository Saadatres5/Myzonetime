import { useState, useEffect } from 'react';

const KEY = 'chronos_favorites';

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(value) {
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* ignore */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(safeRead);

  useEffect(() => { safeWrite(favorites); }, [favorites]);

  const toggleFavorite = (cityName) => {
    setFavorites(prev =>
      prev.includes(cityName)
        ? prev.filter(c => c !== cityName)
        : [...prev, cityName]
    );
  };

  const isFavorite = (cityName) => favorites.includes(cityName);

  return { favorites, toggleFavorite, isFavorite };
}
