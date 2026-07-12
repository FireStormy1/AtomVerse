import React, { useEffect, useRef } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { usePinchZoom } from '../hooks/usePinchZoom';

interface MobilePinchZoomProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function MobilePinchZoom({
  children,
  enabled = false,
  className = '',
}: MobilePinchZoomProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { scale, position, zoomIn, zoomOut, reset, bindViewport } = usePinchZoom(enabled);

  useEffect(() => {
    return bindViewport(viewportRef.current);
  }, [bindViewport, enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  const handleControlZoom = (direction: 'in' | 'out') => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const focal = { x: rect.width / 2, y: rect.height / 2 };

    if (direction === 'in') {
      zoomIn(focal);
    } else {
      zoomOut(focal);
    }
  };

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 w-full ${className}`}>
      <div
        ref={viewportRef}
        className="flex-1 min-h-0 w-full overflow-hidden touch-manipulation"
        style={{ touchAction: scale === 1 ? 'pan-x pan-y' : 'none' }}
      >
        <div
          className="w-full will-change-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {children}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2 md:hidden">
        <div className="pointer-events-auto flex items-center gap-1 glass rounded-full p-1 border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => handleControlZoom('out')}
            className="p-2 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-2 py-1 min-w-[3rem] text-xs font-mono text-muted-foreground hover:text-white transition-colors"
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={() => handleControlZoom('in')}
            className="p-2 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Zoom in"
          >
            <Plus size={16} />
          </button>
        </div>
        {scale !== 1 && (
          <button
            type="button"
            onClick={reset}
            className="pointer-events-auto p-2 glass rounded-full border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors shadow-lg"
            aria-label="Reset view"
            title="Reset view"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
