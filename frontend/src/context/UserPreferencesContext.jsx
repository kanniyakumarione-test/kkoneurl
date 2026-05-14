import { createContext, useContext, useState, useEffect } from 'react';

const UserPreferencesContext = createContext();

export const usePreferences = () => useContext(UserPreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('kk_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    const saved = localStorage.getItem('kk_haptics_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('kk_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('kk_haptics_enabled', JSON.stringify(hapticsEnabled));
  }, [hapticsEnabled]);

  const playZap = () => {
    if (!soundEnabled) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // A clean zap/click sound
    audio.volume = 0.4;
    audio.play().catch(e => console.error('Audio play failed:', e));
    
    if (hapticsEnabled && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ 
      soundEnabled, 
      setSoundEnabled, 
      hapticsEnabled, 
      setHapticsEnabled,
      playZap 
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
