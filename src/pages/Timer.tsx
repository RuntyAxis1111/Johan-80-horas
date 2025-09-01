import React, { useEffect, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useKeyboard } from '../hooks/useKeyboard';
import { useCursorHide } from '../hooks/useCursorHide';
import { fullscreenUtils } from '../utils/fullscreen';
import TimerDisplay from '../components/TimerDisplay';
import TimerControls from '../components/TimerControls';
import SavedMessage from '../components/SavedMessage';

const Timer: React.FC = () => {
  const { seconds, isRunning, isPaused, start, pause, stopAndSave, reset, lastSavedMessage, saveStatus } = useTimer();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const showCursor = useCursorHide(isFullscreen);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(fullscreenUtils.isFullscreen());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useKeyboard({
    onSpace: () => {
      if (!isRunning) {
        start();
      } else if (isPaused) {
        start();
      } else {
        pause();
      }
    },
    onF: () => {
      fullscreenUtils.toggle();
    },
    onR: () => {
      if (isPaused) {
        reset();
      }
    },
    onEscape: () => {
      fullscreenUtils.exit();
    },
  });

  const containerClass = isFullscreen
    ? `fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 ${
        showCursor ? '' : 'cursor-none'
      }`
    : 'min-h-screen bg-black text-white flex items-center justify-center p-8 relative';

  return (
    <div className={containerClass}>
      <SavedMessage message={lastSavedMessage} status={saveStatus} />
      
      {/* Motivation Links - Left Side */}
      {!isFullscreen && !isRunning && (
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <a
            href="https://www.tiktok.com/@prolatam/video/7524747464591691064"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white hover:bg-gray-100 text-black px-2 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 text-sm shadow-xl"
          >
            MUCHAS HORAS
          </a>
        </div>
      )}

      {/* Motivation Links - Right Side */}
      {!isFullscreen && !isRunning && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4">
          <a
            href="https://www.tiktok.com/@focusclub__/video/7517958641920560404"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white hover:bg-gray-100 text-black px-2 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 text-sm shadow-xl"
          >
            DISCIPLINA
          </a>
          <a
            href="https://www.tiktok.com/@dylanarony/video/7375166270104276229"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white hover:bg-gray-100 text-black px-2 py-4 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 text-sm shadow-xl"
          >
            ACTITUD
          </a>
        </div>
      )}

      {/* Main Timer Content */}
      <div className="flex flex-col items-center">
        <TimerDisplay seconds={seconds} isFullscreen={isFullscreen} />
        
        <div className="mt-8">
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={start}
            onPause={pause}
            onStop={stopAndSave}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>
      
      {isPaused && (
        <div className={`mt-6 text-center ${isFullscreen ? 'text-xl' : 'text-lg'}`}>
          <p className="text-yellow-400 mb-2">⏸ Pausado</p>
          <p className="text-gray-400 text-sm">
            Presiona <kbd className="bg-gray-700 px-2 py-1 rounded">Espacio</kbd> para continuar o{' '}
            <kbd className="bg-gray-800 px-2 py-1 rounded">R</kbd> para reiniciar
          </p>
        </div>
      )}
      
      {!isFullscreen && !isRunning && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-center text-gray-400">
            <h3 className="text-lg font-medium mb-3">Atajos de Teclado</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><kbd className="bg-gray-800 px-2 py-1 rounded text-xs">Espacio</kbd> Start/Pause</div>
              <div><kbd className="bg-gray-800 px-2 py-1 rounded text-xs">F</kbd> Pantalla completa</div>
              <div><kbd className="bg-gray-800 px-2 py-1 rounded text-xs">R</kbd> Reset (pausado)</div>
              <div><kbd className="bg-gray-800 px-2 py-1 rounded text-xs">Esc</kbd> Salir completa</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;