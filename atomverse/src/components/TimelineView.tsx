import React from 'react';
import { ElementData } from '../types/element';
import { motion } from 'framer-motion';
import { getCategoryColor } from '../utils/theme';

export function TimelineView({ 
  elements, 
  onSelect 
}: { 
  elements: ElementData[]; 
  onSelect: (el: ElementData) => void; 
}) {
  // Sort elements by yearDiscovered
  const sorted = React.useMemo(() => {
    return [...elements].sort((a, b) => {
      if (a.yearDiscovered === 'Ancient') return -1;
      if (b.yearDiscovered === 'Ancient') return 1;
      return (Number(a.yearDiscovered) || 0) - (Number(b.yearDiscovered) || 0);
    });
  }, [elements]);

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2"></div>
      
      {sorted.map((el, i) => {
        const isAncient = el.yearDiscovered === 'Ancient';
        const isLeft = i % 2 === 0;
        const color = getCategoryColor(el.category);
        
        return (
          <motion.div 
            key={el.atomicNumber}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, type: "spring" }}
            className={`flex w-full mb-12 ${isLeft ? 'justify-start' : 'justify-end'} relative`}
          >
            <div className="absolute left-1/2 top-6 w-3 h-3 rounded-full bg-background border-2 -translate-x-1/2 z-10" style={{ borderColor: color }}></div>
            
            <div className={`w-[45%] ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
              <div 
                className="glass p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group inline-block w-full max-w-sm relative overflow-hidden"
                onClick={() => onSelect(el)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className={`text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50`}>
                  {el.yearDiscovered}
                </div>
                
                <div className={`flex items-center gap-4 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                  {isLeft && (
                    <div>
                      <div className="text-xl font-bold">{el.name}</div>
                      <div className="text-sm text-muted-foreground">{el.discoverer}</div>
                    </div>
                  )}
                  
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center font-display text-2xl font-bold border shadow-lg group-hover:scale-110 transition-transform bg-black/40"
                    style={{ borderColor: `${color}40`, color, boxShadow: `0 0 20px ${color}20` }}
                  >
                    {el.symbol}
                  </div>

                  {!isLeft && (
                    <div>
                      <div className="text-xl font-bold">{el.name}</div>
                      <div className="text-sm text-muted-foreground">{el.discoverer}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
