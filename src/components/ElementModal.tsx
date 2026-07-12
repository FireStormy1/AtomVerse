import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElementData } from '../types/element';
import { X, Search, ChevronRight, Bookmark } from 'lucide-react';
import { getCategoryColor } from '../utils/theme';
import { BohrModel } from './BohrModel';

interface ElementModalProps {
  element: ElementData | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TABS = ['Overview', 'Atomic Structure', 'Properties', 'Applications', 'History', 'Fun Facts'];

export function ElementModal({ element, onClose, isFavorite, onToggleFavorite }: ElementModalProps) {
  const [activeTab, setActiveTab] = React.useState(TABS[0]);

  if (!element) return null;

  const color = getCategoryColor(element.category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          layoutId={`element-${element.atomicNumber}`}
          className="relative w-full max-w-4xl h-[85vh] flex flex-col glass-panel rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
          onClick={e => e.stopPropagation()}
          style={{ '--theme-color': color } as React.CSSProperties}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: 'var(--theme-color)' }}></div>
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--theme-color)' }}></div>
            
            <div className="flex items-center gap-6 z-10">
              <div 
                className="w-24 h-24 rounded-xl flex items-center justify-center glass shadow-lg border border-white/20"
                style={{ boxShadow: `0 0 20px -5px ${color}` }}
              >
                <span className="font-display font-bold text-5xl" style={{ color }}>{element.symbol}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold">{element.name}</h2>
                  <span className="px-2 py-1 rounded text-xs font-mono bg-white/10">{element.atomicNumber}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: color, color }}>
                    {element.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs border border-white/20 text-muted-foreground">
                    {element.stateAtSTP}
                  </span>
                  {element.isRadioactive && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/50">
                      Radioactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 z-10">
              <button 
                onClick={() => window.print()}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Print Fact Sheet"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground hover:text-white"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              </button>
              <button 
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Bookmark size={20} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-yellow-400" : "text-muted-foreground hover:text-white"} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-white/80'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 w-full h-0.5" 
                    style={{ backgroundColor: 'var(--theme-color)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="glass p-4 rounded-xl border border-white/5">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Key Properties</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <PropertyItem label="Atomic Mass" value={`${element.atomicMass} u`} />
                          <PropertyItem label="Period" value={element.period} />
                          <PropertyItem label="Group" value={element.group || '-'} />
                          <PropertyItem label="Block" value={`${element.block}-block`} />
                          <PropertyItem label="Protons" value={element.protons} />
                          <PropertyItem label="Neutrons" value={element.neutrons} />
                        </div>
                      </div>
                      
                      <div className="glass p-4 rounded-xl border border-white/5">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Discovery</h3>
                        <p className="text-lg">{element.discoverer}</p>
                        <p className="text-sm text-muted-foreground">Year: {element.yearDiscovered}</p>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <BohrModel element={element} size={250} />
                      <div className="mt-4 font-mono text-sm tracking-wider opacity-60 text-center">
                        {element.electronConfiguration}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Atomic Structure' && (
                  <div className="flex flex-col items-center h-full">
                    <div className="flex-1 w-full max-w-md mx-auto flex items-center justify-center glass p-8 rounded-2xl border border-white/5 relative">
                      <div className="absolute top-4 left-4 font-mono text-xs text-muted-foreground">
                        Valence: {element.valenceElectrons}e⁻
                      </div>
                      <BohrModel element={element} size={300} />
                    </div>
                    
                    <div className="mt-8 w-full">
                      <h3 className="text-center text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Electron Configuration</h3>
                      <div className="glass px-6 py-4 rounded-xl flex items-center justify-center font-mono text-lg text-primary border border-white/5">
                        {element.electronConfiguration}
                      </div>
                      
                      <div className="flex justify-center gap-2 mt-4 flex-wrap">
                        {element.electrons.map((count, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono">
                              {count}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">n={i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Properties' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-5 rounded-xl border border-white/5">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Thermodynamic</h3>
                      <div className="space-y-4">
                        <BarChartItem label="Melting Point" value={element.meltingPoint} max={4000} unit="K" />
                        <BarChartItem label="Boiling Point" value={element.boilingPoint} max={6000} unit="K" />
                        <BarChartItem label="Density" value={element.density} max={25} unit="g/cm³" />
                      </div>
                    </div>
                    
                    <div className="glass p-5 rounded-xl border border-white/5">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Atomic/Physical</h3>
                      <div className="space-y-4">
                        <BarChartItem label="Electronegativity" value={element.electronegativity} max={4.0} color="#4FC3F7" />
                        <BarChartItem label="Atomic Radius" value={element.atomicRadius} max={300} unit="pm" color="#8B5CF6" />
                        <BarChartItem label="Ionization Energy" value={element.ionizationEnergy} max={2500} unit="kJ/mol" color="#EF5350" />
                      </div>
                    </div>

                    <div className="md:col-span-2 glass p-5 rounded-xl border border-white/5">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Additional Data</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <PropertyItem label="Oxidation States" value={element.oxidationStates || "N/A"} />
                        <PropertyItem label="Crystal Structure" value={element.crystalStructure || "Unknown"} />
                        <PropertyItem label="Abundance in Crust" value={`${element.abundance || 0} mg/kg`} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'History' && (
                  <div className="max-w-2xl mx-auto space-y-8 mt-4">
                    <div className="flex items-center gap-6">
                      <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                        {element.yearDiscovered}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">Discovered by</h3>
                        <p className="text-3xl text-primary">{element.discoverer}</p>
                      </div>
                    </div>
                    
                    <div className="glass p-6 rounded-xl border border-white/5">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Etymology</h3>
                      <p className="text-lg leading-relaxed">{element.namedAfter || "The origins of its name are historical or not clearly recorded."}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'Fun Facts' && (
                  <div className="space-y-4">
                    {element.interestingFacts && element.interestingFacts.length > 0 ? (
                      element.interestingFacts.map((fact, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass p-5 rounded-xl border border-white/5 flex gap-4 items-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-lg leading-relaxed">{fact}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground mt-10">No specific fun facts available for this element.</div>
                    )}
                  </div>
                )}
                
                {activeTab === 'Applications' && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center max-w-md">
                      Detailed applications and uses data coming soon for {element.name}.
                    </p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PropertyItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-mono text-sm font-medium text-white/90">{value}</div>
    </div>
  );
}

function BarChartItem({ label, value, max, unit = "", color = "#10B981" }: { label: string, value: number | null, max: number, unit?: string, color?: string }) {
  const numValue = typeof value === 'number' ? value : 0;
  const percentage = Math.min(100, Math.max(0, (numValue / max) * 100));
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-white/80">{label}</span>
        <span className="text-xs font-mono text-muted-foreground">{value !== null ? `${value} ${unit}` : 'N/A'}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
