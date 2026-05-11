import { useState } from 'react';
import { X, Link2, Lock, Clock, Tag, Globe, Smartphone, Zap, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { generateId, generateSlug } from '../store/linksStore';

const CreateLinkModal = ({ onClose, onAdd }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    originalUrl: '',
    customSlug: '',
    title: '',
    password: '',
    expiresAt: '',
    tags: '',
  });

  const handleCreate = async () => {
    if (!form.originalUrl.trim()) return toast('URL is required', 'error');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    const slug = form.customSlug.trim() || generateSlug(form.originalUrl);
    onAdd({
      id: generateId(),
      ...form,
      shortCode: slug,
      shortUrl: `kkone.url/${slug}`,
      clicks: 0,
      uniqueClicks: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      tags: form.tags ? form.tags.split(',') : [],
      dailyClicks: Array.from({length: 7}, () => ({date: '', clicks: 0})),
      geoStats: {},
      deviceStats: {mobile: 0, desktop: 0, tablet: 0},
      browserStats: {}
    });
    setLoading(false);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-bg-card border border-white/10 rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in">
        <div className="p-8">
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Custom Slug</label>
                  <div className="flex">
                    <span className="px-4 py-3 bg-white/5 border border-white/10 border-r-0 rounded-l-xl text-xs font-bold text-white/20">kkone.url/</span>
                    <input className="input !rounded-l-none" placeholder="slug" value={form.customSlug} onChange={e => setForm({...form, customSlug: e.target.value})} />
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
                <p className="text-purple-light font-black text-2xl">kkone.url/{form.customSlug || '...'}</p>
                <p className="text-xs text-white/20 mt-2 truncate max-w-xs mx-auto">Redirects to {form.originalUrl}</p>
              </div>
              <div className="flex gap-4">
                <button className="btn btn-secondary flex-1 !py-4" onClick={() => {navigator.clipboard.writeText(`kkone.url/${form.customSlug}`); toast('Copied!', 'success')}}>Copy Link</button>
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
