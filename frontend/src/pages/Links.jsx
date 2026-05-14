import { useState } from 'react';
import {
  Search, Plus, Copy, ExternalLink, Trash2,
  Lock, Clock, Tag, Filter, QrCode, Link2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import MoveToBundleModal from '../components/MoveToBundleModal';
import { useAuth } from '../context/AuthContext';

const LinkCard = ({ link, onDelete, onToggle, onCopy, onMove }) => {
  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
  const active = link.is_active ?? link.isActive ?? true;
  const navigate = useNavigate();

  return (
    <div className={`card !p-4 group transition-all duration-500 ${!active ? 'opacity-60 grayscale' : 'hover:border-purple/30 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple/5 cursor-default'}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Row 1: Icon + Title + Status (Always horizontal) */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-lg font-black text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:shadow-purple/30 transition-all duration-500">
            {link.title?.[0]?.toUpperCase() || '🔗'}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-sm truncate group-hover:text-white transition-colors">{link.title || link.short_code}</h3>
              {link.password && <Lock size={12} className="text-orange" />}
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-green shadow-[0_0_8px_rgba(67,233,123,0.5)]' : 'bg-white/20'} group-hover:scale-150 transition-transform`} />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <a href={`https://kkoneurl.com/${link.short_code}`} target="_blank" className="text-purple-light font-bold hover:underline shrink-0 hover:text-white transition-colors">
                /{link.short_code}
              </a>
              <span className="text-white/10">|</span>
              <span className="text-white/30 truncate">{link.original_url || link.originalUrl}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Stats + Actions (Wraps on mobile) */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:flex-1">
          {/* Minimal Stats */}
          <div className="flex gap-4 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-all">
            <div className="text-center min-w-[30px] group-hover:scale-110 transition-transform">
              <p className="text-sm font-black font-display leading-none text-purple-light">{link.clicks || 0}</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Clicks</p>
            </div>
            <div className="text-center min-w-[30px] group-hover:scale-110 transition-transform">
              <p className="text-sm font-black font-display leading-none text-cyan">{Math.round(((link.unique_clicks || 0) / (link.clicks || 1)) * 100)}%</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">CTR</p>
            </div>
          </div>

          {/* Compact Actions */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => onCopy(`https://kkoneurl.com/${link.short_code}`)} className="p-2.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all active:scale-90" title="Copy">
              <Copy size={16} />
            </button>
            <button onClick={() => onMove(link)} className="p-2.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-cyan transition-all active:scale-90" title="Move to Bundle">
              <Tag size={16} />
            </button>
            <button onClick={() => navigate(`/analytics?id=${link._id || link.id}`)} className="p-2.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-purple-light transition-all active:scale-90" title="Analytics">
              <ExternalLink size={16} />
            </button>
            <div className="w-[1px] h-4 bg-white/5 mx-1" />
            <button onClick={() => onDelete(link._id || link.id)} className="p-2.5 rounded-lg hover:bg-pink/10 text-white/20 hover:text-pink transition-all active:scale-90" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Links = ({ links, onDelete, onToggle, onAdd }) => {
  const safeLinks = Array.isArray(links) ? links : [];
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedLink, setSelectedLink] = useState(null);
  const { refreshProfile } = useAuth();

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast('Copied to clipboard!', 'success');
  };

  const filtered = safeLinks.filter(l => {
    const matchesSearch = !search || 
      l.title?.toLowerCase().includes(search.toLowerCase()) || 
      l.short_code?.toLowerCase().includes(search.toLowerCase()) ||
      l.original_url?.toLowerCase().includes(search.toLowerCase());
    
    const active = l.is_active ?? l.isActive ?? true;
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && active) || 
      (filter === 'inactive' && !active);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight mb-2">My Links</h1>
          <p className="text-white/40 text-sm">Managing {safeLinks.length} links across all domains.</p>
        </div>
        <button className="btn btn-primary !rounded-xl active:scale-95 transition-transform" onClick={onAdd}>
          <Plus size={18} /> Create Link
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-bg-card border border-white/10 px-5 py-3 rounded-2xl focus-within:border-purple focus-within:shadow-[0_0_20px_rgba(108,99,255,0.1)] transition-all shadow-xl group">
          <Search size={20} className="text-white/20 group-focus-within:text-purple group-focus-within:scale-110 transition-all" />
          <input 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20"
            placeholder="Search links, slugs, URLs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-bg-card border border-white/10 p-1 rounded-2xl shadow-inner">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${filter === f ? 'bg-purple text-white shadow-lg shadow-purple/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform">
              <Link2 size={32} className="text-white/20 group-hover:text-purple transition-colors" />
            </div>
            <h3 className="font-bold text-xl mb-2">No links found</h3>
            <p className="text-white/40">Try adjusting your search or create a new link.</p>
          </div>
        ) : (
          filtered.map(link => (
            <LinkCard key={link._id || link.id} link={link} onDelete={onDelete} onToggle={onToggle} onCopy={handleCopy} onMove={setSelectedLink} />
          ))
        )}
      </div>

      {selectedLink && (
        <MoveToBundleModal 
          link={selectedLink} 
          onClose={() => setSelectedLink(null)} 
          onUpdate={refreshProfile}
        />
      )}
    </div>
  );
};

export default Links;
