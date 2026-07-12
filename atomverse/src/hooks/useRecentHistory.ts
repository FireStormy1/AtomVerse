import { useState, useEffect } from 'react';
import { ElementData } from '../types/element';

export function useRecentHistory(): [number[], (id: number) => void] {
  const [history, setHistory] = useState<number[]>(() => {
    const saved = localStorage.getItem('atomverse_history');
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
    localStorage.setItem('atomverse_history', JSON.stringify(history));
  }, [history]);

  const addHistory = (id: number) => {
    setHistory(prev => {
      const filtered = prev.filter(f => f !== id);
      return [id, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  return [history, addHistory];
}
