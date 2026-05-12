import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      Object.entries(shortcuts).forEach(([key, callback]) => {
        const [modifier, actualKey] = key.split('+');
        
        if (modifier === 'cmd' && cmdOrCtrl && e.key.toLowerCase() === actualKey.toLowerCase()) {
          e.preventDefault();
          callback();
        } else if (!modifier && e.key.toLowerCase() === key.toLowerCase() && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
