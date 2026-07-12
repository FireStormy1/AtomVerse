import React from 'react';
import { ElementData } from '../types/element';
import { getCategoryClass } from '../utils/theme';
import { motion } from 'framer-motion';

interface ElementCardProps {
  element: ElementData;
  onClick: (element: ElementData) => void;
  isFilteredOut?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  layoutId?: string;
  isHeatmap?: boolean;
  heatmapValue?: number;
  heatmapColor?: string;
}

export const ElementCard = React.memo(({ 
  element, 
  onClick, 
  isFilteredOut = false, 
  isFavorite = false,
  onToggleFavorite,
  layoutId,
  isHeatmap = false,
  heatmapColor
}: ElementCardProps) => {
  // Lanthanides and Actinides need to be placed in separate rows below main table
  // Standard grid: 18 columns. Lanthanides are period 6, but usually placed separately.
  // We'll calculate gridRow and gridColumn.
  
  let gridColumn = element.group || 1;
  let gridRow = element.period;

  // Handle elements without a standard group (Lanthanides/Actinides)
  if (element.atomicNumber >= 57 && element.atomicNumber <= 71) {
    gridRow = 8;
    gridColumn = element.atomicNumber - 57 + 3; // Start at col 3
  } else if (element.atomicNumber >= 89 && element.atomicNumber <= 103) {
    gridRow = 9;
    gridColumn = element.atomicNumber - 89 + 3;
  } else if (element.atomicNumber === 2) {
    // Helium goes to col 18
    gridColumn = 18;
  }

  const categoryClass = getCategoryClass(element.category);
  
  // Base style
  const style = {
    gridColumn,
    gridRow,
  };

  const idleY = Math.sin(element.atomicNumber) * 2;

  if (isHeatmap) {
    return (
      <div
        className={`relative w-full h-full min-h-[64px] min-w-[52px] rounded-sm flex items-center justify-center transition-colors duration-300 ${isFilteredOut ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 cursor-pointer'}`}
        style={{ ...style, backgroundColor: heatmapColor }}
        onClick={() => !isFilteredOut && onClick(element)}
        title={`${element.name}: ${heatmapColor}`}
      >
        <span className="text-black/80 font-bold text-lg">{element.symbol}</span>
      </div>
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative w-full h-full min-h-[70px] min-w-[58px] rounded-md glass transition-all duration-300 overflow-hidden group ${categoryClass} ${isFilteredOut ? 'opacity-0 pointer-events-none invisible scale-95' : 'opacity-100 cursor-pointer hover:z-10'}`}
      style={style}
      onClick={() => !isFilteredOut && onClick(element)}
      whileHover={!isFilteredOut ? { 
        scale: 1.15, 
        y: -5,
        zIndex: 50,
      } : {}}
      animate={!isFilteredOut ? { y: [idleY, -idleY, idleY] } : {}}
      transition={{ 
        y: { repeat: Infinity, duration: 4 + (element.atomicNumber % 3), ease: "easeInOut" },
        scale: { type: 'spring', stiffness: 400, damping: 25 }
      }}
    >
      {/* Dynamic Glow Border inside */}
      <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-[var(--glow-color)] transition-colors duration-300 z-10 pointer-events-none"></div>
      
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-[var(--glow-color)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      <div className="absolute top-1 left-1.5 text-[0.6rem] text-muted-foreground group-hover:text-white transition-colors">
        {element.atomicNumber}
      </div>

      {onToggleFavorite && (
        <div 
          className={`absolute top-1 right-1 cursor-pointer z-20 ${isFavorite ? 'text-yellow-400' : 'text-transparent group-hover:text-muted-foreground hover:text-white'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="font-display font-bold text-xl group-hover:text-[var(--glow-color)] transition-colors group-hover:scale-110 transform duration-300">
          {element.symbol}
        </span>
        <span className="text-[0.55rem] text-muted-foreground truncate w-full text-center px-1 opacity-80 group-hover:opacity-100 group-hover:text-white transition-colors">
          {element.name}
        </span>
      </div>
    </motion.div>
  );
});

ElementCard.displayName = 'ElementCard';
