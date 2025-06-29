import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    // Simulate some initial notifications
    applications: 3,
    messages: 2,
    interviews: 1,
    profile: 0,
    documents: 1,
    settings: 0
  });

  // Simulate periodic notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add notifications to different sections
      const sections = ['applications', 'messages', 'interviews', 'documents'];
      const randomSection = sections[Math.floor(Math.random() * sections.length)];
      
      setNotifications(prev => ({
        ...prev,
        [randomSection]: prev[randomSection] + 1
      }));
    }, 15000); // Add a new notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = (section) => {
    setNotifications(prev => ({
      ...prev,
      [section]: 0
    }));
  };

  const addNotification = (section, count = 1) => {
    setNotifications(prev => ({
      ...prev,
      [section]: prev[section] + count
    }));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      clearNotifications, 
      addNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
