import { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Trash2, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

const SettingsSection = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 text-white/40 uppercase tracking-[0.2em] font-black text-[10px]">
      {icon} <span>{title}</span>
    </div>
    <div className="card space-y-6">
      {children}
    </div>
  </div>
);

const SettingsRow = ({ label, desc, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
    <div className="flex-1">
      <p className="font-bold text-sm mb-1">{label}</p>
      <p className="text-xs text-white/30">{desc}</p>
    </div>
    <div className="shrink-0">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const toast = useToast();
  const { logout, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    public: true,
    notifs: true
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.getProfile();
        setForm({
          name: data.display_name || '',
          email: data.email || '',
          public: data.settings?.publicProfile ?? true,
          notifs: data.settings?.emailNotifs ?? true
        });
      } catch (err) {
        toast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        displayName: form.name,
        settings: {
          publicProfile: form.public,
          emailNotifs: form.notifs
        }
      });
      refreshProfile(); // 🔄 Sync globally
      toast('Settings updated successfully! ✨', 'success');
    } catch (err) {
      toast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.new) return toast('Please enter a new password', 'error');
    try {
      await api.updateProfile({ password: passwordForm.new });
      toast('Password updated successfully!', 'success');
      setPasswordForm({ current: '', new: '' });
      setShowPassword(false);
    } catch (err) {
      toast('Failed to update password', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      toast('Account deleted. We hope to see you again!', 'success');
      logout();
    } catch (err) {
      toast('Failed to delete account', 'error');
    }
  };

  if (loading) return <div className="p-10 text-white/40 uppercase tracking-widest text-[10px] font-black">Loading Preferences...</div>;

  return (
    <div className="max-w-3xl space-y-12 animate-fade-in pb-20">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight mb-2">Settings</h1>
          <p className="text-white/40 text-sm">Account preferences and security</p>
        </div>
        <button 
          onClick={logout}
          className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-pink hover:bg-pink/10 hover:border-pink/20 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <SettingsSection title="Profile" icon={<User size={14} />}>
        <SettingsRow label="Display Name" desc="Used on your public bio page">
          <input className="input sm:w-64" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Display Name" />
        </SettingsRow>
        <div className="h-px w-full bg-white/5" />
        <SettingsRow label="Email Address" desc="For account recovery and alerts">
          <input className="input sm:w-64 opacity-50 cursor-not-allowed" value={form.email} readOnly />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Preferences" icon={<Bell size={14} />}>
        <SettingsRow label="Email Notifications" desc="Weekly reports and click milestones">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.notifs} className="sr-only peer" onChange={() => setForm({...form, notifs: !form.notifs})} />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple peer-checked:after:bg-white" />
          </label>
        </SettingsRow>
        <div className="h-px w-full bg-white/5" />
        <SettingsRow label="Public Profile" desc="Make your /@username page visible">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.public} className="sr-only peer" onChange={() => setForm({...form, public: !form.public})} />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple peer-checked:after:bg-white" />
          </label>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Security" icon={<Shield size={14} />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">New Password</label>
               <div className="relative">
                 <input 
                  type={showPassword ? "text" : "password"} 
                  className="input w-full pr-12" 
                  value={passwordForm.new} 
                  onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} 
                  placeholder="••••••••"
                 />
                 <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                 >
                   {showPassword ? <Eye size={16} className="opacity-40" /> : <Shield size={16} className="opacity-40" />}
                 </button>
               </div>
            </div>
          </div>
          <div className="flex justify-start pt-2">
            <button 
              onClick={handleUpdatePassword}
              className="btn btn-secondary !py-2 !px-4 text-[10px] font-bold uppercase tracking-widest"
            >
              Update Password
            </button>
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-center pt-8">
        <button 
          className={`btn btn-primary !py-4 !px-12 text-sm uppercase font-black tracking-[0.2em] shadow-xl shadow-purple/20 ${saving ? 'opacity-50' : ''}`} 
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Preferences'}
        </button>
      </div>

      <div className="pt-20 border-t border-white/5">
        <h4 className="text-pink text-[10px] font-black uppercase tracking-[0.2em] mb-4">Danger Zone</h4>
        <div className="card border-pink/20 bg-pink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8">
          <div>
            <p className="font-bold text-pink text-lg mb-1">Delete Account</p>
            <p className="text-sm text-pink/50">Once deleted, all your short links, analytics, and bio page data will be gone forever. This cannot be undone.</p>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn bg-pink text-white !py-3 !px-8 text-xs uppercase font-bold tracking-widest hover:bg-pink/80 transition-colors shadow-lg shadow-pink/10"
          >
            <Trash2 size={16} /> Delete Everything
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="card max-w-md w-full border-pink/30 animate-scale-in">
            <div className="flex items-center gap-4 text-pink mb-6">
              <div className="p-3 rounded-full bg-pink/10"><AlertTriangle size={32} /></div>
              <h3 className="text-2xl font-black tracking-tight">Are you absolutely sure?</h3>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed">
              This action is permanent. You will lose all your links and analytics data. Type <strong>DELETE</strong> below to confirm.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button 
                onClick={handleDeleteAccount}
                className="btn bg-pink text-white flex-1 hover:bg-pink/80"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
