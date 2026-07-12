import React from 'react';
import { ElementData } from '../types/element';
import { elements } from '../data/elements';
import { getCategoryColor } from '../utils/theme';

export function DailyElement({ onSelect }: { onSelect: (el: ElementData) => void }) {
  // Deterministic daily element based on current date
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Use a simple seeded random to pick one of the 118 elements
  const x = Math.sin(seed) * 10000;
  const index = Math.floor((x - Math.floor(x)) * 118);
  
  const element = elements[index] || elements[0];
  const color = getCategoryColor(element.category);

  return (
    <div 
      className="glass rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all group border border-white/10 hover:border-white/20 relative overflow-hidden"
      onClick={() => onSelect(element)}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent blur-xl pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Element of the Day</span>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded bg-black/40 flex items-center justify-center font-display font-bold text-lg border border-white/10 shadow-inner group-hover:scale-110 transition-transform"
            style={{ color, boxShadow: `0 0 10px ${color}40` }}
          >
            {element.symbol}
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">{element.name}</div>
            <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
