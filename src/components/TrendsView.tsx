import React from 'react';

export function TrendsView({ 
  property, 
  setProperty 
}: { 
  property: string; 
  setProperty: (p: string) => void;
}) {
  const options = [
    { id: 'electronegativity', label: 'Electronegativity' },
    { id: 'atomicRadius', label: 'Atomic Radius' },
    { id: 'ionizationEnergy', label: 'Ionization Energy' },
    { id: 'atomicMass', label: 'Atomic Mass' },
    { id: 'density', label: 'Density' }
  ];

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="glass rounded-full p-1 flex">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => setProperty(opt.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              property === opt.id 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span>Low</span>
        <div className="w-48 h-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 via-emerald-400 via-yellow-400 to-red-500"></div>
        <span>High</span>
      </div>
    </div>
  );
}
