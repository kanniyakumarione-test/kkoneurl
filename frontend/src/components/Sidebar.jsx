import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Link2, BarChart3, QrCode,
  Users, Settings, Zap, ChevronRight, X, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { path: '/links', icon: <Link2 size={18} />, label: 'My Links' },
  { path: '/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
  { path: '/qr', icon: <QrCode size={18} />, label: 'QR Codes' },
  { path: '/bio', icon: <Users size={18} />, label: 'Bio Page' },
  { path: '/settings', icon: <Settings size={18} />, label: 'Settings' },
];

const adminNavItem = { path: '/admin', icon: <Shield size={18} />, label: 'Admin Panel' };

const Sidebar = ({ open, onClose, links = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout, isAdmin } = useAuth();
  const visibleNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  const linkCount = links.length;
  const linkLimit = 100;
  const percentage = Math.min((linkCount / linkLimit) * 100, 100);

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-bg-secondary border-r border-white/5 
        flex flex-col z-[101] transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple to-purple-dark rounded-xl flex items-center justify-center shadow-lg shadow-purple/30">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">kkone<span className="text-purple-light">url</span></span>
          </div>
          <button className="lg:hidden p-2 text-white/40 hover:text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Plan Info */}
        <div className="px-6 mb-6">
          <div className="bg-bg-card border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-light">Free Plan</span>
              <span className="text-[10px] text-white/30 font-bold">{linkCount}/{linkLimit} links</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple rounded-full shadow-[0_0_8px_#6c63ff] transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          {visibleNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                ${isActive 
                  ? 'bg-purple/10 text-purple-light shadow-[inset_0_0_0_1px_rgba(108,99,255,0.2)]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
              onClick={onClose}
            >
              <span className={`transition-colors ${location.pathname === item.path ? 'text-purple' : 'group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {location.pathname === item.path && <ChevronRight size={14} className="opacity-40" />}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div 
            className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-purple/30 transition-colors cursor-pointer group relative"
            onClick={() => navigate('/settings')}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-light to-cyan rounded-xl flex items-center justify-center font-black text-white text-sm">
              {profile?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{profile?.displayName || user?.email?.split('@')[0]}</p>
              <p className="text-[11px] text-white/30 font-medium truncate uppercase tracking-widest">Active Member</p>
            </div>
            <button 
              className="p-2 text-white/20 hover:text-pink transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
