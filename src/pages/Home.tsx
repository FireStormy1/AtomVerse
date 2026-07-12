import React, { useState } from 'react';
import { PeriodicTable } from '../components/PeriodicTable';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ElementModal } from '../components/ElementModal';
import { DailyElement } from '../components/DailyElement';
import { TrendsView } from '../components/TrendsView';
import { TimelineView } from '../components/TimelineView';
import { QuizModal } from '../components/QuizModal';
import { RecentHistory } from '../components/RecentHistory';
import { elements } from '../data/elements';
import { ElementData, ElementCategory } from '../types/element';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentHistory } from '../hooks/useRecentHistory';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Sparkles, BarChart2, List, FlaskConical, Clock, BrainCircuit, User } from 'lucide-react';
import { AboutModal } from '../components/AboutModal';
import { MobilePinchZoom } from '../components/MobilePinchZoom';
import { useIsMobile } from '../hooks/use-mobile';

type ViewMode = 'table' | 'trends' | 'timeline';

export function Home() {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [heatmapProperty, setHeatmapProperty] = useState('electronegativity');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  const [filters, setFilters] = useState<{
    categories: ElementCategory[];
    state: 'All' | 'Solid' | 'Liquid' | 'Gas';
    radioactive: boolean;
    synthetic: boolean;
  }>({
    categories: [],
    state: 'All',
    radioactive: false,
    synthetic: false
  });

  const [favorites, toggleFavorite] = useFavorites();
  const [recent, addRecent] = useRecentHistory();
  const isMobile = useIsMobile();
  const pinchZoomEnabled = isMobile && viewMode !== 'timeline';

  // Handle Search input focusing
  useKeyboardShortcuts({
    onSearchFocus: () => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    },
    onCloseModal: () => {
      setSelectedElement(null);
      setQuizOpen(false);
      setAboutOpen(false);
    },
    onNextElement: () => {
      if (selectedElement && selectedElement.atomicNumber < 118) {
        setSelectedElement(elements[selectedElement.atomicNumber]);
      }
    },
    onPrevElement: () => {
      if (selectedElement && selectedElement.atomicNumber > 1) {
        setSelectedElement(elements[selectedElement.atomicNumber - 2]);
      }
    },
    onToggleFavorite: () => {
      if (selectedElement) {
        toggleFavorite(selectedElement.atomicNumber);
      }
    }
  });

  const handleElementSelect = (el: ElementData) => {
    setSelectedElement(el);
    addRecent(el.atomicNumber);
  };

  const filteredElements = React.useMemo(() => {
    return elements.filter(el => {
      // Favorites filter
      if (favoritesOnly && !favorites.includes(el.atomicNumber)) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(
          el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.atomicNumber.toString() === q
        )) {
          return false;
        }
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(el.category)) return false;

      // State
      if (filters.state !== 'All') {
        const stateStr = el.stateAtSTP ? el.stateAtSTP.toLowerCase() : '';
        if (!stateStr.includes(filters.state.toLowerCase())) return false;
      }

      // Radioactive
      if (filters.radioactive && !el.isRadioactive) return false;

      // Synthetic (Not Natural)
      if (filters.synthetic && el.isNatural) return false;

      return true;
    });
  }, [searchQuery, filters, favoritesOnly, favorites]);

  return (
    <div className="min-h-[100dvh] relative text-white flex flex-col font-sans selection:bg-primary/30">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass z-40 px-6 flex items-center justify-between border-b border-white/5">
        <button
          onClick={() => {
            setViewMode('table');
            setSearchQuery('');
            setFilters({ categories: [], state: 'All', radioactive: false, synthetic: false });
            setFavoritesOnly(false);
            setSelectedElement(null);
          }}
          className="flex items-center gap-3 group/logo cursor-pointer"
          title="Go to home"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(79,195,247,0.5)] border border-primary/50 relative overflow-hidden group">
            <FlaskConical size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
            <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></div>
          </div>
          <span className="font-display font-bold text-2xl tracking-wide hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 group-hover/logo:from-[#4FC3F7] group-hover/logo:to-white/80 transition-all duration-300">AtomVerse</span>
        </button>

        <div className="flex-1 max-w-xl flex justify-center px-4">
          <SearchBar elements={elements} onSelect={handleElementSelect} onFilterChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`p-2.5 rounded-full transition-all border ${favoritesOnly ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'glass text-muted-foreground hover:text-white border-white/10'}`}
            title="Toggle Favorites"
          >
            <Sparkles size={18} />
          </button>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex glass rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-full transition-all ${viewMode === 'table' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('trends')}
              className={`p-2 rounded-full transition-all ${viewMode === 'trends' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
              title="Trends View"
            >
              <BarChart2 size={18} />
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-full transition-all ${viewMode === 'timeline' ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
              title="Timeline View"
            >
              <Clock size={18} />
            </button>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <button
            onClick={() => setAboutOpen(true)}
            className="p-2.5 rounded-full glass text-muted-foreground hover:text-white border border-white/10 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(79,195,247,0.3)] hover:border-primary/50"
            title="About Me"
            aria-label="Open About Me"
          >
            <User size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 pt-24 pb-12 px-4 flex flex-col relative z-10 ${pinchZoomEnabled ? 'min-h-0 overflow-hidden' : ''}`}>
        <MobilePinchZoom enabled={pinchZoomEnabled}>
          {/* Top controls section */}
          {viewMode !== 'timeline' && (
            <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <div className="flex-1">
                {viewMode === 'table' ? (
                  <FilterBar filters={filters} setFilters={setFilters} />
                ) : (
                  <div className="mt-6 flex justify-center w-full">
                    <TrendsView property={heatmapProperty} setProperty={setHeatmapProperty} />
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block shrink-0 z-20">
                <DailyElement onSelect={handleElementSelect} />
              </div>
            </div>
          )}

          {/* Table/View Area */}
          <div className="flex-1 w-full flex justify-center mt-4">
            {viewMode === 'timeline' ? (
              <TimelineView elements={filteredElements} onSelect={handleElementSelect} />
            ) : (
              <PeriodicTable 
                elements={elements} 
                onElementClick={handleElementSelect}
                filteredElements={filteredElements}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isHeatmap={viewMode === 'trends'}
                heatmapProperty={heatmapProperty as keyof ElementData}
              />
            )}
          </div>
        </MobilePinchZoom>
      </main>

      <RecentHistory historyIds={recent} elements={elements} onSelect={handleElementSelect} />

      {/* Quiz Button */}
      <button 
        onClick={() => setQuizOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-background p-4 rounded-full shadow-[0_0_20px_rgba(79,195,247,0.3)] hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modals */}
      <ElementModal 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
        isFavorite={selectedElement ? favorites.includes(selectedElement.atomicNumber) : false}
        onToggleFavorite={() => selectedElement && toggleFavorite(selectedElement.atomicNumber)}
      />

      {quizOpen && <QuizModal elements={elements} onClose={() => setQuizOpen(false)} />}

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
