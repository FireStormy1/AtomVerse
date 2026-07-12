import React from 'react';
import { ElementData } from '../types/element';
import { getCategoryColor } from '../utils/theme';

export function RecentHistory({ 
  historyIds, 
  elements, 
  onSelect 
}: { 
  historyIds: number[]; 
  elements: ElementData[]; 
  onSelect: (el: ElementData) => void;
}) {
  if (historyIds.length === 0) return null;

  const recentElements = historyIds
    .map(id => elements.find(e => e.atomicNumber === id))
    .filter(Boolean) as ElementData[];

  return (
    <div className="fixed bottom-4 left-4 z-40 glass rounded-xl p-3 border border-white/10 hidden md:block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Recently Viewed</div>
      <div className="flex gap-2">
        {recentElements.map(el => (
          <button
            key={el.atomicNumber}
            onClick={() => onSelect(el)}
            className="w-8 h-8 rounded bg-white/5 border border-white/10 hover:border-white/30 flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
            style={{ color: getCategoryColor(el.category) }}
            title={el.name}
          >
            {el.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
