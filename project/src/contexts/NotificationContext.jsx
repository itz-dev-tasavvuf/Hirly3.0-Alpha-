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
    jobs: 2,
    matches: 5, // Start with 5 new matches
    messages: 3,
    dashboard: 1,
    profile: 0,
    verify_algorand: 0,
    settings: 0,
    coach: 1,
    // Employer specific
    candidates: 4,
    upload_jobs: 0,
    company: 0
  });

  // Simulate periodic notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add notifications to different sections
      const sections = ['jobs', 'matches', 'messages', 'dashboard', 'candidates'];
      const randomSection = sections[Math.floor(Math.random() * sections.length)];
      
      // For matches, simulate getting 1-3 new matches at once
      if (randomSection === 'matches') {
        const newMatches = Math.floor(Math.random() * 3) + 1; // 1-3 new matches
        setNotifications(prev => ({
          ...prev,
          matches: prev.matches + newMatches
        }));
      } else {
        setNotifications(prev => ({
          ...prev,
          [randomSection]: prev[randomSection] + 1
        }));
      }
    }, 12000); // Add notifications every 12 seconds (slightly faster for demo)

    return () => clearInterval(interval);
  }, []);

  // Simulate specific match notifications
  const addMatchNotifications = (count = 1) => {
    setNotifications(prev => ({
      ...prev,
      matches: prev.matches + count
    }));
  };

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
      addNotification,
      addMatchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
