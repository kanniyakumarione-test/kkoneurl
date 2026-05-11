import { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Link2, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      toast('Settings updated successfully!', 'success');
    } catch (err) {
      toast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white/40 uppercase tracking-widest text-[10px] font-black">Loading Preferences...</div>;

  return (
    <div className="max-w-3xl space-y-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-display tracking-tight mb-2">Settings</h1>
        <p className="text-white/40 text-sm">Account preferences and security</p>
      </div>

      <SettingsSection title="Profile" icon={<User size={14} />}>
        <SettingsRow label="Display Name" desc="Used on your public bio page">
          <input className="input sm:w-64" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </SettingsRow>
        <div className="h-px w-full bg-white/5" />
        <SettingsRow label="Email Address" desc="For account recovery and alerts">
          <input className="input sm:w-64" value={form.email} readOnly />
        </SettingsRow>
        <div className="flex justify-end pt-4">
          <button 
            className={`btn btn-primary !py-2.5 !px-6 text-xs uppercase font-bold tracking-widest ${saving ? 'opacity-50' : ''}`} 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
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
        <SettingsRow label="Change Password" desc="Keep your account secure">
          <button className="btn btn-secondary !py-2 !px-4 text-xs font-bold uppercase tracking-widest">Update Password</button>
        </SettingsRow>
      </SettingsSection>

      <div className="pt-12 border-t border-white/5">
        <h4 className="text-pink text-[10px] font-black uppercase tracking-[0.2em] mb-4">Danger Zone</h4>
        <div className="card border-pink/20 bg-pink/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold text-pink mb-1">Delete Account</p>
            <p className="text-xs text-pink/50">Permanently remove all links and data</p>
          </div>
          <button className="btn bg-pink text-white !py-2.5 !px-6 text-xs uppercase font-bold tracking-widest hover:bg-pink/80 transition-colors">
            <Trash2 size={14} /> Delete Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
