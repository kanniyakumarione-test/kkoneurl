import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`
              pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl
              bg-bg-card/80 backdrop-blur-xl border border-white/10
              shadow-[0_20px_50px_rgba(0,0,0,0.4)] min-w-[320px] max-w-md
              animate-slide-in-right transition-all duration-300
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${t.type === 'success' ? 'bg-green/10 text-green shadow-lg shadow-green/20' : 
                t.type === 'error' ? 'bg-pink/10 text-pink shadow-lg shadow-pink/20' : 
                'bg-purple/10 text-purple shadow-lg shadow-purple/20'}
            `}>
              {t.type === 'success' && <CheckCircle size={20} />}
              {t.type === 'error' && <XCircle size={20} />}
              {t.type === 'info' && <Zap size={20} fill="currentColor" />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold text-white tracking-tight">{t.message}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mt-0.5">System Notification</p>
            </div>

            <button 
              onClick={() => remove(t.id)} 
              className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
