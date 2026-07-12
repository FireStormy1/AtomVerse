import React, { useState, useEffect } from 'react';

interface LocalStorageHook<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
}

export function useFavorites(): [number[], (id: number) => void] {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('atomverse_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('atomverse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return [favorites, toggleFavorite];
}
