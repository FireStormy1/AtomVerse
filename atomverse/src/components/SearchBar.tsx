import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { ElementData } from '../types/element';
import { getCategoryColor } from '../utils/theme';

interface SearchBarProps {
  elements: ElementData[];
  onSelect: (element: ElementData) => void;
  onFilterChange: (query: string) => void;
}

export function SearchBar({ elements, onSelect, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return elements.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.symbol.toLowerCase().includes(q) || 
      e.atomicNumber.toString() === q ||
      e.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, elements]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onFilterChange(val);
  };

  const handleClear = () => {
    setQuery('');
    onFilterChange('');
  };

  return (
    <div className="relative z-50 w-full max-w-md" ref={containerRef}>
      <div className={`relative flex items-center glass rounded-full overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-primary border-primary/50 bg-card/80 shadow-[0_0_20px_rgba(79,195,247,0.2)]' : 'border-white/10'}`}>
        <div className="pl-4 pr-2 text-muted-foreground">
          <Search size={18} className={isFocused ? 'text-primary' : ''} />
        </div>
        <input 
          type="text" 
          placeholder="Search element, symbol, atomic number (press /)" 
          className="flex-1 bg-transparent border-none outline-none py-2.5 text-sm text-white placeholder:text-muted-foreground/60"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button onClick={handleClear} className="pr-4 text-muted-foreground hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && query && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 glass-panel rounded-xl overflow-hidden py-2 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {results.map(el => (
            <div 
              key={el.atomicNumber}
              className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors"
              onClick={() => {
                onSelect(el);
                setIsFocused(false);
                setQuery('');
                onFilterChange('');
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold text-sm" style={{ color: getCategoryColor(el.category) }}>
                  {el.symbol}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/90 group-hover:text-white">{el.name}</div>
                  <div className="text-xs text-muted-foreground">{el.atomicNumber} • {el.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
