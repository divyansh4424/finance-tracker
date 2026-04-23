import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const settings = storage.getSettings();
    setDarkMode(settings.darkMode);
    
    // Apply dark mode class to document
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = storage.toggleDarkMode();
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return newDarkMode;
  };

  return { darkMode, toggleDarkMode };
};
