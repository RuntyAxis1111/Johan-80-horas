import { useState, useEffect, useCallback } from 'react';
import { Session } from '../types';
import { supabaseStorage } from '../utils/supabaseStorage';
import { fullscreenUtils } from '../utils/fullscreen';
import { dateUtils } from '../utils/dateUtils';

export const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lastSavedMessage, setLastSavedMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const [settings, setSettings] = useState({ weeklyGoal: 80, exitFullscreenOnPause: true });

  useEffect(() => {
    const loadSettings = async () => {
      const userSettings = await supabaseStorage.getSettings();
      setSettings(userSettings);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const start = useCallback(async () => {
    if (!isRunning) {
      setStartTime(new Date());
      setSeconds(0);
      setIsRunning(true);
      setIsPaused(false);
      await fullscreenUtils.enter();
    } else if (isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const pause = useCallback(async () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      if (settings.exitFullscreenOnPause) {
        await fullscreenUtils.exit();
      }
    }
  }, [isRunning, isPaused, settings.exitFullscreenOnPause]);

  const stopAndSave = useCallback(async () => {
    if (isRunning && startTime && seconds >= 5) {
      try {
        const endTime = new Date();
        const sessionData = {
          startTime,
          endTime,
          duration: seconds,
          source: 'web' as const,
        };
        
        const success = await supabaseStorage.addSession(sessionData);
        
        if (success) {
          const durationText = dateUtils.formatDurationDetailed(seconds);
          const message = `Sesión guardada exitosamente: ${durationText}`;
          setLastSavedMessage(message);
          setSaveStatus('success');
        } else {
          const message = 'Error al guardar la sesión. Inténtalo de nuevo.';
          setLastSavedMessage(message);
          setSaveStatus('error');
        }
        
        setTimeout(() => {
          setLastSavedMessage(null);
          setSaveStatus(null);
        }, 4000);
      } catch (error) {
        const message = 'Error al guardar la sesión. Inténtalo de nuevo.';
        setLastSavedMessage(message);
        setSaveStatus('error');
        setTimeout(() => {
          setLastSavedMessage(null);
          setSaveStatus(null);
        }, 4000);
        console.error('Error saving session:', error);
      }
    } else if (isRunning && seconds < 5) {
      const message = 'Sesión muy corta (menos de 5 segundos). No se guardó.';
      setLastSavedMessage(message);
      setSaveStatus('error');
      setTimeout(() => {
        setLastSavedMessage(null);
        setSaveStatus(null);
      }, 3000);
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setStartTime(null);
    await fullscreenUtils.exit();
  }, [isRunning, startTime, seconds]);

  const reset = useCallback(() => {
    if (isPaused) {
      setSeconds(0);
      setStartTime(new Date());
    }
  }, [isPaused]);

  return {
    seconds,
    isRunning,
    isPaused,
    start,
    pause,
    stopAndSave,
    reset,
    lastSavedMessage,
    saveStatus,
  };
};