import { Bell, Menu, Plus, Search, X, Check, Clock, Shield, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as api from '../api';

const Topbar = ({ onMenuClick, onShorten }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const unreadCount = safeNotifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const { data } = await api.fetchNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Notif load error:', err);
      }
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(safeNotifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(safeNotifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'milestone': return <TrendingUp size={14} className="text-green" />;
      case 'security': return <Shield size={14} className="text-pink" />;
      case 'system': return <Zap size={14} className="text-purple-light" />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <header className="sticky top-0 z-[90] h-16 border-b border-white/5 bg-bg-secondary/80 backdrop-blur-xl px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 text-white/40 hover:text-white" onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className={`
          hidden md:flex items-center gap-3 bg-bg-card border border-white/10 px-4 py-2 rounded-xl transition-all duration-300
          ${searching ? 'w-full max-w-md border-purple ring-4 ring-purple/10' : 'w-64'}
        `}>
          <Search size={16} className="text-white/20" />
          <input
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/20"
            placeholder="Search links..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearching(true)}
            onBlur={() => { if (!query) setSearching(false); }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearching(false); }} className="text-white/20 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all border
              ${showNotifs ? 'bg-purple/10 border-purple/50 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-purple/30'}
            `}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-bg-secondary animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-bg-card border border-white/10 rounded-2xl shadow-2xl animate-scale-in z-[100] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-purple-light hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {safeNotifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <Bell size={32} className="mx-auto mb-3 opacity-10" />
                    <p className="text-xs text-white/20 font-bold uppercase tracking-widest">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {safeNotifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer group ${!n.is_read ? 'bg-purple/5' : ''}`}
                        onClick={() => handleMarkRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                            {getIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white mb-0.5 truncate">{n.title}</p>
                            <p className="text-xs text-white/40 line-clamp-2 mb-2">{n.message}</p>
                            <div className="flex items-center gap-2 text-[10px] text-white/20 font-medium">
                              <Clock size={10} />
                              {new Date(n.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          {!n.is_read && <div className="w-2 h-2 rounded-full bg-purple mt-2 shadow-[0_0_8px_#6c63ff]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <button 
          className="btn btn-primary !py-2 !px-5 !rounded-xl text-sm" 
          onClick={onShorten}
        >
          <Plus size={18} className="md:hidden" />
          <span className="hidden md:inline">Create Link</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
