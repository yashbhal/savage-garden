import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LightNotification from '../../components/notifications/LightNotification';

// Sample notification messages
const NOTIFICATION_MESSAGES = [
  "Turn on the glow lamp for Plant 1",
  "Your Monstera needs watering",
  "Basil humidity is below optimal levels",
  "Tomato plant needs more light",
  "Snake plant soil is too dry",
  "Mint plant is ready for harvesting",
  "Check your Aloe Vera for pests",
];

interface NotificationContextType {
  showNotification: (message: string, duration?: number) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  autoNotifyInterval?: number; // in milliseconds
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  autoNotifyInterval = 30000 // Default to 30 seconds
}) => {
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [notificationDuration, setNotificationDuration] = useState(5000);

  // Function to show a notification
  const showNotification = (message: string, duration = 5000) => {
    setCurrentNotification(message);
    setNotificationDuration(duration);
  };

  // Function to hide the current notification
  const hideNotification = () => {
    setCurrentNotification(null);
  };

  // Auto-notification effect
  useEffect(() => {
    // Show a random notification every interval
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * NOTIFICATION_MESSAGES.length);
      showNotification(NOTIFICATION_MESSAGES[randomIndex]);
    }, autoNotifyInterval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [autoNotifyInterval]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {currentNotification && (
        <LightNotification 
          message={currentNotification} 
          duration={notificationDuration} 
          onClose={hideNotification} 
        />
      )}
    </NotificationContext.Provider>
  );
};
