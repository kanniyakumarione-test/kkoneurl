import { useState } from 'react';
import { X, Link2, Lock, Clock, Tag, Globe, Smartphone, Zap, Check, Eye, EyeOff, Sparkles } from 'lucide-react';

import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { generateId, generateSlug } from '../store/linksStore';


const CreateLinkModal = ({ onClose, onAdd, initialUrl }) => {
  const { profile } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [createdLink, setCreatedLink] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    originalUrl: initialUrl || '',
    customSlug: '',
    title: '',
    password: '',
    expiresAt: '',
    tags: '',
  });

  const handleCreate = async () => {
    if (!form.originalUrl.trim()) return toast('URL is required', 'error');
    setLoading(true);
    
    try {
      const newLink = await onAdd({
        originalUrl: form.originalUrl,
        customSlug: form.customSlug.trim(),
        title: form.title,
        password: form.password,
        expiresAt: form.expiresAt,
        tags: form.tags,
        device_routing: {
          ios: form.iosUrl,
          android: form.androidUrl
        },
        ab_test: {
          enabled: form.abEnabled,
          url_b: form.urlB,
          split: form.abSplit
        }
      });
      
      setCreatedLink(newLink);
      setStep(2);
    } catch (err) {
      // Toast handled in App.jsx
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-bg-card border border-white/10 rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="p-8 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple to-purple-dark rounded-2xl flex items-center justify-center shadow-lg shadow-purple/20">
                <Zap size={20} fill="white" className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-display">{step === 1 ? 'Create Link' : 'Success!'}</h2>
                <p className="text-sm text-white/40">{step === 1 ? 'Configure your short URL settings' : 'Your link is ready for the world'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Destination URL</label>
                <div className="relative">
                  <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input className="input !pl-12" placeholder="https://..." value={form.originalUrl} onChange={e => setForm({...form, originalUrl: e.target.value})} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center justify-between">
                    Custom Slug
                    {profile?.plan !== 'pro' && !profile?.is_admin && (
                      <span className="flex items-center gap-1 text-purple-light text-[8px] animate-pulse">
                        <Sparkles size={8} /> PRO
                      </span>
                    )}
                  </label>
                  <div className="flex relative">
                    <span className="px-4 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-[10px] font-bold text-white/20">kkoneurl.kanniyakumarione.com/</span>
                    <input 
                      className={`input !rounded-l-none ${profile?.plan !== 'pro' && !profile?.is_admin ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      placeholder={profile?.plan !== 'pro' && !profile?.is_admin ? "Pro Only" : "slug"} 
                      value={form.customSlug} 
                      onChange={e => {
                        if (profile?.plan !== 'pro' && !profile?.is_admin) {
                          toast('Custom slugs require a Pro subscription.', 'info');
                          return;
                        }
                        setForm({...form, customSlug: e.target.value});
                      }} 
                      readOnly={profile?.plan !== 'pro' && !profile?.is_admin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Link Title</label>
                  <input className="input" placeholder="Optional" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Lock size={12} /> Password</label>
                  <div className="relative">
                    <input 
                      className="input !pr-10" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={form.password} 
                      onChange={e => setForm({...form, password: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"><Clock size={12} /> Expiry</label>
                  <input className="input" type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-light flex items-center gap-2"><Zap size={12} /> Advanced Routing</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 flex items-center gap-2"><Smartphone size={10} /> iOS Redirect</label>
                    <input className="input !py-2 !text-xs" placeholder="App Store URL..." value={form.iosUrl || ''} onChange={e => setForm({...form, iosUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 flex items-center gap-2"><Globe size={10} /> Android Redirect</label>
                    <input className="input !py-2 !text-xs" placeholder="Play Store URL..." value={form.androidUrl || ''} onChange={e => setForm({...form, androidUrl: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-widest text-cyan flex items-center gap-2"><Zap size={12} /> A/B Testing</p>
                   <button className={`w-8 h-4 rounded-full transition-all ${form.abEnabled ? 'bg-cyan' : 'bg-white/10'}`} onClick={() => setForm({...form, abEnabled: !form.abEnabled})}><div className={`w-3 h-3 bg-white rounded-full transition-all ${form.abEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} /></button>
                </div>
                {form.abEnabled && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40">URL Variation B</label>
                      <input className="input !py-2 !text-xs" placeholder="https://variation-b.com" value={form.urlB || ''} onChange={e => setForm({...form, urlB: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40">Split (%)</label>
                      <input type="number" className="input !py-2 !text-xs" placeholder="50" value={form.abSplit || 50} onChange={e => setForm({...form, abSplit: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>

              <button 
                className={`btn btn-primary w-full !py-4 !rounded-2xl shadow-glow mt-4 ${loading ? 'opacity-50' : ''}`}
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Generate Magic Link'}
              </button>
            </div>
          ) : (
            <div className="py-10 text-center space-y-8">
              <div className="w-20 h-20 bg-green/10 border border-green/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green/10">
                <Check size={40} className="text-green" />
              </div>
              <div className="card !bg-bg-secondary border-purple/30">
                <p className="text-purple-light font-black text-2xl">kkoneurl.kanniyakumarione.com/{createdLink?.short_code}</p>
                <p className="text-xs text-white/20 mt-2 truncate max-w-xs mx-auto">Redirects to {createdLink?.original_url}</p>
              </div>
              <div className="flex gap-4">
                <button className="btn btn-secondary flex-1 !py-4" onClick={() => {navigator.clipboard.writeText(`https://kkoneurl.kanniyakumarione.com/${createdLink?.short_code}`); toast('Copied!', 'success')}}>Copy Link</button>
                <button className="btn btn-primary flex-1 !py-4" onClick={onClose}>Done</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLinkModal;
