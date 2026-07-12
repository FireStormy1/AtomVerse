import { useCallback, useRef, useState } from 'react';

export const PINCH_MIN_SCALE = 0.35;
export const PINCH_MAX_SCALE = 2.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTouchDistance(touches: TouchList) {
  if (touches.length < 2) return 0;
  return Math.hypot(
    touches[1].clientX - touches[0].clientX,
    touches[1].clientY - touches[0].clientY,
  );
}

function getTouchCenter(touches: TouchList, container: DOMRect) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2 - container.left,
    y: (touches[0].clientY + touches[1].clientY) / 2 - container.top,
  };
}

export function usePinchZoom(enabled: boolean) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const scaleRef = useRef(1);
  const positionRef = useRef({ x: 0, y: 0 });
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
    pos: { x: number; y: number };
  } | null>(null);
  const panStartRef = useRef<{
    x: number;
    y: number;
    pos: { x: number; y: number };
  } | null>(null);

  const syncScale = useCallback((nextScale: number) => {
    scaleRef.current = nextScale;
    setScale(nextScale);
  }, []);

  const syncPosition = useCallback((nextPosition: { x: number; y: number }) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, focal?: { x: number; y: number }) => {
      const clamped = clamp(nextScale, PINCH_MIN_SCALE, PINCH_MAX_SCALE);
      const oldScale = scaleRef.current;
      const pos = positionRef.current;

      if (focal && oldScale !== 0) {
        syncPosition({
          x: focal.x - ((focal.x - pos.x) / oldScale) * clamped,
          y: focal.y - ((focal.y - pos.y) / oldScale) * clamped,
        });
      }

      syncScale(clamped);
    },
    [syncPosition, syncScale],
  );

  const reset = useCallback(() => {
    syncScale(1);
    syncPosition({ x: 0, y: 0 });
  }, [syncPosition, syncScale]);

  const zoomIn = useCallback(
    (focal?: { x: number; y: number }) => {
      zoomTo(scaleRef.current * 1.2, focal);
    },
    [zoomTo],
  );

  const zoomOut = useCallback(
    (focal?: { x: number; y: number }) => {
      zoomTo(scaleRef.current / 1.2, focal);
    },
    [zoomTo],
  );

  const bindViewport = useCallback(
    (viewport: HTMLDivElement | null) => {
      if (!enabled || !viewport) return;

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 2) {
          pinchStartRef.current = {
            distance: getTouchDistance(event.touches),
            scale: scaleRef.current,
            pos: { ...positionRef.current },
          };
          panStartRef.current = null;
        } else if (event.touches.length === 1 && scaleRef.current !== 1) {
          panStartRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
            pos: { ...positionRef.current },
          };
          pinchStartRef.current = null;
        }
      };

      const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 2 && pinchStartRef.current) {
          event.preventDefault();
          const rect = viewport.getBoundingClientRect();
          const start = pinchStartRef.current;
          const distance = getTouchDistance(event.touches);
          if (start.distance === 0) return;

          const nextScale = clamp(
            start.scale * (distance / start.distance),
            PINCH_MIN_SCALE,
            PINCH_MAX_SCALE,
          );
          const center = getTouchCenter(event.touches, rect);

          syncScale(nextScale);
          syncPosition({
            x: center.x - ((center.x - start.pos.x) / start.scale) * nextScale,
            y: center.y - ((center.y - start.pos.y) / start.scale) * nextScale,
          });
        } else if (event.touches.length === 1 && panStartRef.current) {
          event.preventDefault();
          const start = panStartRef.current;
          syncPosition({
            x: start.pos.x + (event.touches[0].clientX - start.x),
            y: start.pos.y + (event.touches[0].clientY - start.y),
          });
        }
      };

      const onTouchEnd = () => {
        if (pinchStartRef.current) {
          pinchStartRef.current = null;
        }
        panStartRef.current = null;
      };

      viewport.addEventListener('touchstart', onTouchStart, { passive: true });
      viewport.addEventListener('touchmove', onTouchMove, { passive: false });
      viewport.addEventListener('touchend', onTouchEnd);
      viewport.addEventListener('touchcancel', onTouchEnd);

      return () => {
        viewport.removeEventListener('touchstart', onTouchStart);
        viewport.removeEventListener('touchmove', onTouchMove);
        viewport.removeEventListener('touchend', onTouchEnd);
        viewport.removeEventListener('touchcancel', onTouchEnd);
      };
    },
    [enabled, syncPosition, syncScale],
  );

  return {
    scale,
    position,
    zoomIn,
    zoomOut,
    reset,
    bindViewport,
  };
}
