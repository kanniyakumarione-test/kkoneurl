import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, ExternalLink, Eye, Palette, Save, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import * as api from '../api';

const THEMES = [
  { id: 'dark-purple', label: 'Dark Purple', bg: 'linear-gradient(135deg,#0e0a1f,#1a1040)', accent: '#6c63ff' },
  { id: 'dark-cyan', label: 'Dark Cyan', bg: 'linear-gradient(135deg,#071828,#0a1f2e)', accent: '#00d4ff' },
  { id: 'midnight', label: 'Midnight', bg: 'linear-gradient(135deg,#07070f,#12121a)', accent: '#9b94ff' },
];

const BioPreview = ({ bioPage, theme }) => {
  const t = THEMES.find(t => t.id === theme) || THEMES[0];
  return (
    <div className="w-[280px] h-[560px] bg-[#111] rounded-[40px] border-[8px] border-[#222] overflow-hidden shadow-2xl relative">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#222] rounded-b-2xl z-10" />
      
      <div className="h-full p-8 flex flex-col items-center gap-2 overflow-y-auto" style={{ background: t.bg }}>
        <div className="w-16 h-16 rounded-full border-2 mt-8 mb-2 flex items-center justify-center bg-white/5 overflow-hidden" style={{ borderColor: t.accent }}>
          {bioPage.avatar ? <img src={bioPage.avatar} className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
        </div>
        <p className="text-sm font-bold text-white text-center truncate w-full">{bioPage.displayName}</p>
        <p className="text-[10px] text-white/50 text-center mb-4 leading-relaxed">{bioPage.bio}</p>
        
        <div className="w-full space-y-2">
          {bioPage.links.map(link => (
            <div key={link.id} className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2 transition-all hover:scale-[1.02]" style={{ borderColor: `${link.color}30` }}>
              <span className="text-xs">{link.icon}</span>
              <span className="text-[10px] font-bold text-white flex-1 truncate">{link.label}</span>
              <ExternalLink size={10} className="text-white/20" />
            </div>
          ))}
        </div>
        
        <p className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: t.accent }}>kkoneurl</p>
      </div>
    </div>
  );
};

const BioPage = ({ bioPage, setBioPage }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('links');
  const [newLink, setNewLink] = useState({ label: '', url: '', icon: '🔗', color: '#6c63ff' });
  const [saving, setSaving] = useState(false);
  
  // Tracking username change limits
  const [originalUsername, setOriginalUsername] = useState('');
  const [usernameLastChanged, setUsernameLastChanged] = useState(null);
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
          links: data.bio_links || []
        };
        setBioPage(profile);
        setOriginalUsername(profile.username);
        
        // Calculate 60-day limit
        if (data.username_last_changed) {
          const lastChanged = new Date(data.username_last_changed);
          const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;
          const now = new Date();
          const diff = now - lastChanged;
          
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
  }, []);

  const handleSave = async () => {
    // Prevent save if username changed illegally
    if (bioPage.username !== originalUsername && !canChangeUsername) {
      return toast(`You can change your username in ${daysRemaining} days.`, 'error');
    }

    setSaving(true);
    try {
      const response = await api.updateProfile({
        username: bioPage.username,
        displayName: bioPage.displayName,
        bio: bioPage.bio,
        avatar: bioPage.avatar,
        theme: bioPage.theme,
        bio_links: bioPage.links
      });
      
      toast('Bio page saved successfully! ✨', 'success');
      setOriginalUsername(bioPage.username);
      // Refresh limit if username was changed
      if (response.data?.username_last_changed) {
          const lastChanged = new Date(response.data.username_last_changed);
          const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;
          const diff = new Date() - lastChanged;
          if (diff < sixtyDaysInMs) {
            setCanChangeUsername(false);
            setDaysRemaining(Math.ceil((sixtyDaysInMs - diff) / (24 * 60 * 60 * 1000)));
          }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save bio page';
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUsernameChange = (val) => {
    // 🛠️ Automatic Sanitization: spaces to underscores, lowercase only
    const sanitized = val.replace(/\s+/g, '_').toLowerCase();
    setBioPage(prev => ({ ...prev, username: sanitized }));
  };

  const addLink = () => {
    if (!newLink.label || !newLink.url) return toast('Fill in label and URL', 'error');
    const link = { ...newLink, id: Math.random().toString(36).slice(2) };
    setBioPage(prev => ({ ...prev, links: [...prev.links, link] }));
    setNewLink({ label: '', url: '', icon: '🔗', color: '#6c63ff' });
  };

  const removeLink = (id) => {
    setBioPage(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
  };

  const updateField = (field, val) => setBioPage(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight mb-2">Bio Page</h1>
          <div className="flex items-center gap-2 group">
            <p className="text-white/40 text-sm">Your personal link-in-bio hub: <span className="text-purple-light font-bold">kkoneurl.vercel.app/@{bioPage.username || 'username'}</span></p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://kkoneurl.vercel.app/@${bioPage.username}`);
                toast('Link copied! Ready to share.', 'success');
              }}
              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-purple/20 hover:border-purple/40 transition-all opacity-0 group-hover:opacity-100"
              title="Copy Share Link"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <a 
            href={`/@${bioPage.username}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-secondary !py-2 !px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Eye size={14} /> Preview
          </a>
          <button 
            className={`btn btn-primary !py-2 !px-4 text-xs font-bold uppercase tracking-widest ${saving ? 'opacity-50' : ''}`} 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card !p-0 overflow-hidden">
            <div className="flex border-b border-white/5">
              {['links', 'profile', 'theme'].map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-purple/10 text-purple border-b-2 border-purple' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'links' && (
                <div className="space-y-4">
                  {bioPage.links.map(link => (
                    <div key={link.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-purple/30 transition-all">
                      <div className="text-white/20 cursor-grab"><GripVertical size={16} /></div>
                      <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-xl">{link.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{link.label}</p>
                        <p className="text-xs text-white/30 truncate">{link.url}</p>
                      </div>
                      <button 
                        className="p-2 text-white/20 hover:text-pink transition-colors"
                        onClick={() => removeLink(link.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <div className="card !bg-bg-secondary/50 border-dashed border-white/10 mt-8">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-white/40">Add New Link</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input className="input" placeholder="Link Title" value={newLink.label} onChange={e => setNewLink({...newLink, label: e.target.value})} />
                      <input className="input" placeholder="URL (https://...)" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                    </div>
                    <button className="btn btn-secondary w-full mt-4 !py-3 !rounded-xl text-xs font-bold uppercase tracking-widest" onClick={addLink}>
                      <Plus size={14} /> Add to Page
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Username</label>
                        {!canChangeUsername && (
                          <span className="text-[9px] font-bold text-pink flex items-center gap-1">
                             <AlertCircle size={10} /> Locked for {daysRemaining}d
                          </span>
                        )}
                      </div>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">@</span>
                        <input 
                          className={`input !pl-8 ${!canChangeUsername ? 'opacity-50 cursor-not-allowed bg-white/5' : ''}`} 
                          value={bioPage.username} 
                          onChange={e => handleUsernameChange(e.target.value)}
                          disabled={!canChangeUsername}
                          placeholder="yourname"
                        />
                      </div>
                      <p className="text-[9px] text-white/20 italic">Username can only be changed once every 60 days.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Display Name</label>
                      <input className="input" value={bioPage.displayName} onChange={e => updateField('displayName', e.target.value)} placeholder="Full Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Bio Description</label>
                    <textarea className="input min-h-[100px]" value={bioPage.bio} onChange={e => updateField('bio', e.target.value)} placeholder="Tell the world about yourself..." />
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      className={`
                        p-4 rounded-2xl border transition-all text-left space-y-3
                        ${bioPage.theme === t.id ? 'border-purple bg-purple/10' : 'border-white/5 bg-white/5 hover:border-white/20'}
                      `}
                      onClick={() => updateField('theme', t.id)}
                    >
                      <div className="h-12 w-full rounded-lg" style={{ background: t.bg }} />
                      <p className="text-[10px] font-black uppercase tracking-widest">{t.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="sticky top-24">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 text-center mb-6">Live Mobile Preview</p>
            <BioPreview bioPage={bioPage} theme={bioPage.theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioPage;
