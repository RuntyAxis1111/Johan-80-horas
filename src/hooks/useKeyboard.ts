import { useEffect } from 'react';

interface KeyboardHandlers {
  onSpace?: () => void;
  onF?: () => void;
  onR?: () => void;
  onEscape?: () => void;
}

export const useKeyboard = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          handlers.onSpace?.();
          break;
        case 'KeyF':
          event.preventDefault();
          handlers.onF?.();
          break;
        case 'KeyR':
          event.preventDefault();
          handlers.onR?.();
          break;
        case 'Escape':
          event.preventDefault();
          handlers.onEscape?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};