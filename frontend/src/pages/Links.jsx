import { useState } from 'react';
import {
  Search, Plus, Copy, ExternalLink, Trash2,
  Lock, Clock, Tag, Filter, QrCode, Link2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LinkCard = ({ link, onDelete, onToggle, onCopy }) => {
  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <div className={`
      card !p-0 overflow-hidden group transition-all
      ${!link.isActive ? 'opacity-60 grayscale' : 'hover:-translate-y-1'}
    `}>
      <div className="p-5 flex flex-col md:flex-row gap-6">
        {/* Favicon / Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-xl font-black text-white shadow-lg shadow-purple/20 shrink-0">
          {link.title?.[0]?.toUpperCase() || '🔗'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h3 className="font-bold text-lg leading-tight truncate">{link.title || link.shortCode}</h3>
            {link.password && <span className="badge bg-orange/10 text-orange border border-orange/20"><Lock size={10} /> Protected</span>}
            {isExpired && <span className="badge bg-pink/10 text-pink border border-pink/20"><Clock size={10} /> Expired</span>}
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <a href={`https://${link.shortUrl}`} target="_blank" className="text-purple-light font-bold text-sm hover:underline">
              {link.shortUrl}
            </a>
            <span className="text-white/20">→</span>
            <span className="text-white/40 text-xs truncate max-w-[300px]">{link.originalUrl}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {link.tags?.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                <Tag size={10} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="flex gap-8 items-center bg-white/5 px-6 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-lg font-black font-display leading-none">{link.clicks.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black font-display leading-none">{Math.round((link.uniqueClicks / link.clicks) * 100) || 0}%</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">CTR</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col justify-center gap-2">
          <button onClick={() => onCopy(link.shortUrl)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:border-purple/40 hover:bg-purple/10 transition-all" title="Copy">
            <Copy size={18} />
          </button>
          <button onClick={() => onDelete(link._id)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-pink hover:border-pink/40 hover:bg-pink/10 transition-all" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Toggle Row */}
      <div className="px-5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green' : 'bg-white/20'}`} />
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
            {link.isActive ? 'Live' : 'Inactive'}
          </span>
        </div>
        <button className="text-xs font-bold text-purple-light hover:text-white transition-colors flex items-center gap-1">
          <ExternalLink size={12} /> View Full Analytics
        </button>
      </div>
    </div>
  );
};

const Links = ({ links, onDelete, onToggle, onAdd }) => {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast('Copied to clipboard!', 'success');
  };

  const filtered = links.filter(l => 
    !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight mb-2">My Links</h1>
          <p className="text-white/40 text-sm">Managing {links.length} links across all domains.</p>
        </div>
        <button className="btn btn-primary !rounded-xl" onClick={onAdd}>
          <Plus size={18} /> Create Link
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-bg-card border border-white/10 px-5 py-3 rounded-2xl focus-within:border-purple transition-all shadow-xl">
          <Search size={20} className="text-white/20" />
          <input 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20"
            placeholder="Search links, slugs, URLs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-bg-card border border-white/10 p-1 rounded-2xl">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-purple text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
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
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Link2 size={32} className="text-white/20" />
            </div>
            <h3 className="font-bold text-xl mb-2">No links found</h3>
            <p className="text-white/40">Try adjusting your search or create a new link.</p>
          </div>
        ) : (
          filtered.map(link => (
            <LinkCard key={link._id} link={link} onDelete={onDelete} onToggle={onToggle} onCopy={handleCopy} />
          ))
        )}
      </div>
    </div>
  );
};

export default Links;
