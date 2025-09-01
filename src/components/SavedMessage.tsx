import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface SavedMessageProps {
  message: string | null;
  status?: 'success' | 'error' | null;
}

const SavedMessage: React.FC<SavedMessageProps> = ({ message, status = 'success' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, status === 'error' ? 4000 : 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, status]);

  if (!message || !isVisible) return null;

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={24} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={24} className="text-red-400" />;
      default:
        return <AlertTriangle size={24} className="text-yellow-400" />;
    }
  };

  const getStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-900 border-green-600 text-green-100';
      case 'error':
        return 'bg-red-900 border-red-600 text-red-100';
      default:
        return 'bg-yellow-900 border-yellow-600 text-yellow-100';
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`${getStyles()} px-6 py-4 rounded-lg shadow-2xl border-2 flex items-center space-x-3 max-w-md backdrop-blur-sm`}>
        {getIcon()}
        <span className="text-base font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SavedMessage;