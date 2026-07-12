import React, { useMemo } from 'react';
import { ElementCard } from './ElementCard';
import { ElementData } from '../types/element';
import { motion } from 'framer-motion';

interface PeriodicTableProps {
  elements: ElementData[];
  onElementClick: (element: ElementData) => void;
  filteredElements: ElementData[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  isHeatmap?: boolean;
  heatmapProperty?: keyof ElementData;
}

export function PeriodicTable({ 
  elements, 
  onElementClick, 
  filteredElements, 
  favorites,
  onToggleFavorite,
  isHeatmap = false,
  heatmapProperty
}: PeriodicTableProps) {
  
  const filteredSet = useMemo(() => new Set(filteredElements.map(e => e.atomicNumber)), [filteredElements]);

  // Colormap logic for heatmap
  const getHeatmapColor = (element: ElementData) => {
    if (!isHeatmap || !heatmapProperty) return undefined;
    const val = element[heatmapProperty];
    if (typeof val !== 'number' || val === 0 || isNaN(val)) return '#1f2937'; // gray for no data
    
    // Find min and max
    const validValues = elements.map(e => e[heatmapProperty]).filter(v => typeof v === 'number' && v > 0) as number[];
    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    
    const normalized = (val - min) / (max - min || 1);
    
    // Cool to hot: blue(240) -> cyan(180) -> green(120) -> yellow(60) -> red(0)
    const hue = (1 - normalized) * 240; 
    return `hsl(${hue}, 80%, 50%)`;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 overflow-x-auto relative">
      <div className="min-w-[1000px]">
        <div className="periodic-grid mb-4">
          {elements.map(el => {
            // Only render elements up to Z=118
            if (el.atomicNumber > 118) return null;
            return (
              <ElementCard
                key={el.atomicNumber}
                element={el}
                onClick={onElementClick}
                isFilteredOut={!filteredSet.has(el.atomicNumber)}
                isFavorite={favorites.includes(el.atomicNumber)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(el.atomicNumber);
                }}
                layoutId={`element-${el.atomicNumber}`}
                isHeatmap={isHeatmap}
                heatmapColor={getHeatmapColor(el)}
              />
            );
          })}
        </div>
        
        {/* Placeholder text indicating Lanthanides and Actinides */}
        <div className="flex gap-4 ml-[16.6%] mt-6 text-sm text-muted-foreground/50">
          <div className="flex items-center gap-2">
            <span>* Lanthanides</span>
            <div className="w-12 h-1 bg-pink-500/20"></div>
          </div>
          <div className="flex items-center gap-2">
            <span>** Actinides</span>
            <div className="w-12 h-1 bg-red-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
