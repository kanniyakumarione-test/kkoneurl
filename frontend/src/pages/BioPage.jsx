import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Eye, Save, AlertCircle, Play, Zap, Share2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../api';

const THEMES = [
  { id: 'dark-purple', label: 'Dark Purple', bg: 'linear-gradient(135deg,#0e0a1f,#1a1040)', accent: '#6c63ff', pro: false },
  { id: 'dark-cyan', label: 'Dark Cyan', bg: 'linear-gradient(135deg,#071828,#0a1f2e)', accent: '#00d4ff', pro: false },
  { id: 'midnight', label: 'Midnight', bg: 'linear-gradient(135deg,#07070f,#12121a)', accent: '#9b94ff', pro: false },
  { id: 'glass-purple', label: 'Glass Purple', bg: 'linear-gradient(135deg,#6c63ff,#9b94ff)', accent: '#fff', glass: true, pro: true },
  { id: 'glass-cyan', label: 'Glass Cyan', bg: 'linear-gradient(135deg,#00d4ff,#00e5ff)', accent: '#fff', glass: true, pro: true },
  { id: 'neo-dark', label: 'Neo Dark', bg: '#121212', accent: '#43e97b', neo: true, pro: true },
  { id: 'custom', label: 'Custom Design', pro: true, isCustom: true }
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', icon: '📸', label: 'Instagram' },
  { id: 'github', icon: '🐙', label: 'GitHub' },
  { id: 'x', icon: '𝕏', label: 'X (Twitter)' },
  { id: 'youtube', icon: '🎬', label: 'YouTube' },
  { id: 'linkedin', icon: '💼', label: 'LinkedIn' },
];

const BioPreview = ({ bioPage, theme, className = "" }) => {
  const t = THEMES.find(t => t.id === theme) || THEMES[0];
  const bg = theme === 'custom' ? bioPage.customBg : t.bg;
  const accent = theme === 'custom' ? bioPage.customAccent : t.accent;
  
  return (
    <div className={`w-[280px] h-[560px] bg-[#111] rounded-[40px] border-[8px] border-[#222] overflow-hidden shadow-2xl relative flex-shrink-0 ${className}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#222] rounded-b-2xl z-10" />
      <div className="h-full p-8 flex flex-col items-center gap-2 overflow-y-auto custom-scrollbar" style={{ background: bg }}>
        <div className="w-16 h-16 rounded-full border-2 mt-8 mb-2 flex items-center justify-center bg-white/5 overflow-hidden flex-shrink-0" style={{ borderColor: accent }}>
          {bioPage.avatar ? <img src={bioPage.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <span className="text-2xl">👤</span>}
        </div>
        <p className="text-sm font-bold text-white text-center truncate w-full">{bioPage.displayName || 'Your Name'}</p>
        <p className="text-[10px] text-white/50 text-center mb-4 leading-relaxed line-clamp-2 px-4">{bioPage.bio || 'Add your bio description...'}</p>

        {/* Social Icons Bar in Preview */}
        {Object.values(bioPage.socialLinks || {}).some(v => v) && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
             {Object.entries(bioPage.socialLinks).map(([id, url]) => url && (
               <div key={id} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                 <Share2 size={10} className="text-white/40" />
               </div>
             ))}
          </div>
        )}

        <div className="w-full space-y-2 mb-4">
          {bioPage.links.map(link => (
            <div key={link.id} className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2 transition-all" style={{ borderColor: `${link.color}30` }}>
              <span className="text-xs">{link.icon}</span>
              <span className="text-[10px] font-bold text-white flex-1 truncate">{link.label}</span>
              <ExternalLink size={10} className="text-white/20" />
            </div>
          ))}
        </div>

        {/* Embeds in Preview */}
        {bioPage.embeds?.slice(0, 1).map((embed, i) => (
          <div key={i} className="w-full aspect-video rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-2 mb-4">
            <Play size={20} className="text-white/20" />
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{embed.type} preview</span>
          </div>
        ))}

        <p className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: accent }}>Powered by kkoneurl</p>
      </div>
    </div>
  );
};

const BioPage = ({ bioPage, setBioPage }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshProfile, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('links');

  const [newLink, setNewLink] = useState({ label: '', url: '', icon: '🔗', color: '#6c63ff' });
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [originalUsername, setOriginalUsername] = useState('');
  const [showAddEmbed, setShowAddEmbed] = useState(false);
  const [newEmbed, setNewEmbed] = useState({ type: 'youtube', url: '' });
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.getProfile();
        const profile = {
          username: data.username || '',
          displayName: data.display_name || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
           theme: data.theme || 'dark-purple',
          customBg: data.custom_bg || 'linear-gradient(135deg, #1a1a2e, #16213e)',
          customAccent: data.custom_accent || '#6c63ff',
          links: data.bio_links || [],
          socialLinks: data.social_links || {},
          embeds: data.embeds || [],
        };
        setBioPage(profile);
        setOriginalUsername(profile.username);
        
        if (data.username_customized && data.username_last_changed) {
          const lastChanged = new Date(data.username_last_changed);
          const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;
          const diff = new Date() - lastChanged;
          if (diff < sixtyDaysInMs) {
            setCanChangeUsername(false);
            setDaysRemaining(Math.ceil((sixtyDaysInMs - diff) / (24 * 60 * 60 * 1000)));
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    loadProfile();
  }, [setBioPage]);

  const handleSave = async () => {
    if (bioPage.username !== originalUsername && !canChangeUsername) {
      return toast(`You can change your username in ${daysRemaining} days.`, 'error');
    }

    setSaving(true);
    try {
      await api.updateProfile({
        username: bioPage.username,
        displayName: bioPage.displayName,
        bio: bioPage.bio,
        avatar: bioPage.avatar,
        theme: bioPage.theme,
        custom_bg: bioPage.customBg,
        custom_accent: bioPage.customAccent,
        bio_links: bioPage.links,
        social_links: bioPage.socialLinks,
        embeds: bioPage.embeds,
      });
      
      toast('Bio page saved successfully! ✨', 'success');
      setOriginalUsername(bioPage.username);
      refreshProfile();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    if (!newLink.label || !newLink.url) return toast('Fill in label and URL', 'error');
    const link = { ...newLink, id: Math.random().toString(36).slice(2) };
    setBioPage(prev => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({ label: '', url: '', icon: '🔗', color: '#6c63ff' });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight mb-1">Bio Page</h1>
          <p className="text-white/40 text-xs md:text-sm">Manage your personal hub: <span className="text-purple-light font-bold truncate">@{bioPage.username}</span></p>
        </div>
        <div className="flex w-full md:w-auto gap-2 md:gap-3">
          <a href={`/@${bioPage.username}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none btn btn-secondary !py-2 !px-4 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"><ExternalLink size={14} /> Visit</a>
          <button className={`flex-1 md:flex-none btn btn-primary !py-2 !px-4 text-[10px] md:text-xs font-black uppercase tracking-widest ${saving ? 'opacity-50' : ''}`} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative">
        {/* Editor Side */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card !p-0 overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
              {['links', 'social', 'embeds', 'profile', 'theme'].map(tab => (
                <button key={tab} className={`flex-1 min-w-[90px] py-4 md:py-5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-purple/10 text-purple-light border-b-2 border-purple-light' : 'text-white/40 hover:text-white hover:bg-white/5'}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>

            <div className="p-4 md:p-8">
              {activeTab === 'links' && (
                <div className="space-y-4">
                  {bioPage.links.map(link => (
                    <div key={link.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group transition-all hover:border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-xl flex-shrink-0">{link.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{link.label}</p>
                        <p className="text-[10px] text-white/20 truncate font-mono">{link.url}</p>
                      </div>
                      <button className="p-2 text-white/20 hover:text-pink transition-colors" onClick={() => setBioPage(prev => ({ ...prev, links: prev.links.filter(l => l.id !== link.id) }))}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <div className="card !bg-bg-secondary/30 border-dashed border-white/10 mt-8 p-6">
                    <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-white/30">Add New Link</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <input className="input" placeholder="Link Title (e.g. My Portfolio)" value={newLink.label} onChange={e => setNewLink({...newLink, label: e.target.value})} />
                      <input className="input" placeholder="URL (https://...)" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                    </div>
                    <button className="btn btn-secondary w-full mt-4 !py-3 !rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={addLink}><Plus size={14} /> Add to Page</button>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SOCIAL_PLATFORMS.map(p => (
                    <div key={p.id} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">{p.icon} {p.label}</label>
                      <input className="input" placeholder={`https://${p.id}.com/username`} value={bioPage.socialLinks?.[p.id] || ''} onChange={e => setBioPage(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [p.id]: e.target.value } }))} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'embeds' && (
                <div className="space-y-6">
                  {profile?.plan !== 'pro' && !profile?.is_admin ? (
                    <div className="p-12 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01] flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-purple-light"><Play size={24} /></div>
                      <div>
                        <h4 className="font-bold mb-1">Rich Media is a Pro Feature</h4>
                        <p className="text-xs text-white/30 max-w-xs mx-auto">Embed YouTube videos and Spotify tracks directly onto your bio page to engage your audience.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/settings')}
                        className="btn btn-primary !py-2.5 !px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        Upgrade to Pro <Sparkles size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {bioPage.embeds?.map((embed, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                          <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center text-purple-light">{embed.type === 'youtube' ? <Play size={20} /> : <Zap size={20} />}</div>
                          <div className="flex-1 min-w-0"><p className="font-bold text-sm uppercase tracking-widest">{embed.type}</p><p className="text-[10px] text-white/30 truncate font-mono">ID: {embed.id}</p></div>
                          <button className="p-2 text-white/20 hover:text-pink transition-colors" onClick={() => setBioPage(prev => ({ ...prev, embeds: prev.embeds.filter((_, idx) => idx !== i) }))}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      {showAddEmbed ? (
                        <div className="p-6 bg-purple/10 border border-purple/20 rounded-3xl space-y-4 animate-fade-in">
                          <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                            {['youtube', 'spotify'].map(t => (
                              <button key={t} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${newEmbed.type === t ? 'bg-purple text-white shadow-lg' : 'text-white/40 hover:text-white'}`} onClick={() => setNewEmbed({...newEmbed, type: t})}>{t}</button>
                            ))}
                          </div>
                          <input 
                            className="input !bg-black/20" 
                            placeholder={newEmbed.type === 'youtube' ? "Paste YouTube Video URL..." : "Paste Spotify Track URL..."}
                            value={newEmbed.url}
                            onChange={e => setNewEmbed({...newEmbed, url: e.target.value})}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button className="btn btn-secondary flex-1 !py-3" onClick={() => { setShowAddEmbed(false); setNewEmbed({ type: 'youtube', url: '' }); }}>Cancel</button>
                            <button className="btn btn-primary flex-1 !py-3 font-black text-[10px] uppercase" onClick={() => {
                              const { type, url } = newEmbed;
                              if (!url) return;
                              let id = type === 'youtube' ? url.split('v=')[1]?.split('&')[0] || url.split('/').pop() : url.split('/track/')[1]?.split('?')[0];
                              if (id) {
                                setBioPage(prev => ({ ...prev, embeds: [...(prev.embeds || []), { type, id }] }));
                                setShowAddEmbed(false);
                                setNewEmbed({ type: 'youtube', url: '' });
                              }
                            }}>Add Embed</button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn-secondary w-full !py-5 rounded-2xl border-dashed border-white/10 hover:border-purple/40 group" onClick={() => setShowAddEmbed(true)}>
                          <Plus size={14} className="group-hover:scale-125 transition-transform" /> Add Rich Media Content
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Username</label>
                      <input className="input" value={bioPage.username} disabled={!canChangeUsername} onChange={e => setBioPage({...bioPage, username: e.target.value.toLowerCase().replace(/\s+/g, '_')})} />
                      {!canChangeUsername && (
                        <p className="text-[10px] text-amber-300/80 flex items-center gap-1">
                          <AlertCircle size={10} /> Username locked for {daysRemaining} days.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Display Name</label>
                      <input className="input" placeholder="e.g. John Doe" value={bioPage.displayName} onChange={e => setBioPage({...bioPage, displayName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Bio Description</label>
                    <textarea className="input min-h-[120px] custom-scrollbar" placeholder="Tell the world about yourself..." value={bioPage.bio} onChange={e => setBioPage({...bioPage, bio: e.target.value})} />
                  </div>
                </div>
              )}

               {activeTab === 'theme' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {THEMES.map(t => (
                      <button 
                        key={t.id} 
                        className={`p-4 rounded-2xl border transition-all text-left space-y-3 relative overflow-hidden ${bioPage.theme === t.id ? 'border-purple-light bg-purple/10' : 'border-white/5 bg-white/5 hover:border-white/20'} ${t.pro && profile?.plan !== 'pro' && !profile?.is_admin ? 'opacity-70 grayscale' : ''}`} 
                        onClick={() => {
                          if (t.pro && profile?.plan !== 'pro' && !profile?.is_admin) {
                            toast('This is a Pro theme! Upgrade to unlock.', 'info');
                            return;
                          }
                          setBioPage({...bioPage, theme: t.id})
                        }}
                      >
                        {t.pro && profile?.plan !== 'pro' && !profile?.is_admin && (
                          <div className="absolute top-2 right-2 bg-purple/80 text-white p-1 rounded-lg">
                            <Sparkles size={10} />
                          </div>
                        )}
                        <div className="h-16 w-full rounded-lg shadow-inner flex items-center justify-center text-white/20" style={{ background: t.isCustom ? bioPage.customBg : t.bg }}>
                          {t.isCustom && <Zap size={24} />}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-center">{t.label}</p>
                      </button>
                    ))}
                  </div>

                  {bioPage.theme === 'custom' && (
                    <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Sparkles size={12} /> Background Design</label>
                          <div className="space-y-3">
                            <input 
                              className="input font-mono text-xs" 
                              value={bioPage.customBg} 
                              onChange={e => setBioPage({...bioPage, customBg: e.target.value})} 
                              placeholder="hex, rgb, or linear-gradient..."
                            />
                            <div className="flex gap-2 flex-wrap">
                              {['#000000', 'linear-gradient(135deg, #1a1a2e, #16213e)', 'linear-gradient(45deg, #0f0c29, #302b63, #24243e)'].map(p => (
                                <button key={p} className="w-8 h-8 rounded-lg border border-white/10" style={{ background: p }} onClick={() => setBioPage({...bioPage, customBg: p})} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Plus size={12} /> Accent Color</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="color" 
                              className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer" 
                              value={bioPage.customAccent} 
                              onChange={e => setBioPage({...bioPage, customAccent: e.target.value})} 
                            />
                            <input 
                              className="input font-mono text-xs uppercase" 
                              value={bioPage.customAccent} 
                              onChange={e => setBioPage({...bioPage, customAccent: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/20 italic text-center">Pro Tip: You can paste full CSS gradients in the background field! ✨</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Preview Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col items-center sticky top-24 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Eye size={12} className="text-white/20" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Live Mobile Preview</p>
          </div>
          <BioPreview bioPage={bioPage} theme={bioPage.theme} />
        </div>
      </div>

      {/* Floating Mobile Preview Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="w-14 h-14 rounded-full bg-purple text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Eye size={24} />
        </button>
      </div>

      {/* Mobile Preview Modal */}
      {isPreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="absolute top-6 right-6">
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white"
            >
              <Trash2 size={24} />
            </button>
          </div>
          <div className="scale-[0.85] md:scale-100">
            <BioPreview bioPage={bioPage} theme={bioPage.theme} />
          </div>
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/20">Interactive Preview Mode</p>
        </div>
      )}
    </div>
  );
};

export default BioPage;
