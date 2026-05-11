import { Bell, Menu, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

const Topbar = ({ onMenuClick, onShorten }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

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
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:border-purple/30 transition-all">
          <Bell size={20} />
          {/* Real notification logic can be added here */}
        </button>

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
