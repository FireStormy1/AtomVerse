import { useEffect } from 'react';

type KeyboardShortcutHandlers = {
  onSearchFocus?: () => void;
  onCloseModal?: () => void;
  onNextElement?: () => void;
  onPrevElement?: () => void;
  onToggleFavorite?: () => void;
  onCopySymbol?: () => void;
};

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if inside an input unless it's Escape
      if (
        (e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        if (e.key === 'Escape' && handlers.onCloseModal) {
          handlers.onCloseModal();
        }
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          handlers.onSearchFocus?.();
          break;
        case 'Escape':
          handlers.onCloseModal?.();
          break;
        case 'ArrowRight':
          handlers.onNextElement?.();
          break;
        case 'ArrowLeft':
          handlers.onPrevElement?.();
          break;
        case 'f':
        case 'F':
          handlers.onToggleFavorite?.();
          break;
        case 'c':
        case 'C':
          handlers.onCopySymbol?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
