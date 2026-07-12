import React from 'react';
import { ElementCategory } from '../types/element';

interface FilterState {
  categories: ElementCategory[];
  state: 'All' | 'Solid' | 'Liquid' | 'Gas';
  radioactive: boolean;
  synthetic: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const ALL_CATEGORIES: ElementCategory[] = [
  "Alkali Metal", "Alkaline Earth Metal", "Transition Metal", 
  "Post-Transition Metal", "Metalloid", "Nonmetal", 
  "Halogen", "Noble Gas", "Lanthanide", "Actinide"
];

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  
  const toggleCategory = (cat: ElementCategory) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(cat);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.state !== 'All' || filters.radioactive || filters.synthetic;

  const resetFilters = () => {
    setFilters({ categories: [], state: 'All', radioactive: false, synthetic: false });
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-4 text-sm mt-6 max-w-[1400px] mx-auto px-4 z-20 relative">
      <div className="flex gap-2 items-center text-muted-foreground mr-2 font-medium text-xs uppercase tracking-widest">
        Filters
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map(cat => {
          const isActive = filters.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 border ${
                isActive 
                  ? `border-[var(--cat-color)] bg-[var(--cat-color)]/20 text-white shadow-[0_0_10px_var(--cat-color)]` 
                  : 'border-white/10 hover:border-white/30 text-muted-foreground hover:text-white bg-black/20'
              }`}
              style={{ '--cat-color': getCategoryVar(cat) } as React.CSSProperties}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

      <div className="flex gap-2">
        {(['All', 'Solid', 'Liquid', 'Gas'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilters(prev => ({ ...prev, state: s }))}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
              filters.state === s ? 'border-primary bg-primary/20 text-white' : 'border-white/10 hover:border-white/30 text-muted-foreground'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilters(prev => ({ ...prev, radioactive: !prev.radioactive }))}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
            filters.radioactive ? 'border-red-500 bg-red-500/20 text-white' : 'border-white/10 hover:border-white/30 text-muted-foreground'
          }`}
        >
          Radioactive
        </button>
      </div>

      {hasActiveFilters && (
        <button 
          onClick={resetFilters}
          className="ml-auto text-xs text-muted-foreground hover:text-white underline underline-offset-2 transition-colors"
        >
          Reset All
        </button>
      )}
    </div>
  );
}

function getCategoryVar(category: string) {
  switch (category) {
    case 'Alkali Metal': return 'hsl(var(--color-alkali))';
    case 'Alkaline Earth Metal': return 'hsl(var(--color-alkaline))';
    case 'Transition Metal': return 'hsl(var(--color-transition))';
    case 'Halogen': return 'hsl(var(--color-halogen))';
    case 'Noble Gas': return 'hsl(var(--color-noble))';
    case 'Lanthanide': return 'hsl(var(--color-lanthanide))';
    case 'Actinide': return 'hsl(var(--color-actinide))';
    case 'Post-Transition Metal': return 'hsl(var(--color-post-transition))';
    case 'Metalloid': return 'hsl(var(--color-metalloid))';
    case 'Nonmetal': return 'hsl(var(--color-nonmetal))';
    default: return 'hsl(var(--muted-foreground))';
  }
}
