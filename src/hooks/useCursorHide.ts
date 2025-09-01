import { useEffect, useState } from 'react';

export const useCursorHide = (isFullscreen: boolean) => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isFullscreen) {
      setShowCursor(true);
      return;
    }

    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowCursor(false);
      }, 2000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Hide cursor after 2 seconds initially
    timeout = setTimeout(() => {
      setShowCursor(false);
    }, 2000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  return showCursor;
};