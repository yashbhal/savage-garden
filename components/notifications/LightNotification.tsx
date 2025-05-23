import { useEffect, useState } from 'react';

interface LightNotificationProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const LightNotification: React.FC<LightNotificationProps> = ({ 
  message = "Turn on the glow lamp for Plant 1", 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white/95 rounded-lg shadow-md border border-primary/20 p-3 flex items-center gap-3 z-50 max-w-xs animate-fade-in">
      <div className="text-primary flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="text-sm text-secondary-dark">
        {message}
      </div>
    </div>
  );
};

export default LightNotification;
