import { useEffect, useState } from 'react';
import { Shield, Mail, User2, Link2, MousePointerClick, Activity, Globe, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import * as api from '../api';
import { useToast } from '../context/ToastContext';

const AdminPanel = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalLinks: 0, totalClicks: 0 });
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, linksRes] = await Promise.all([
          api.fetchAdminStats(),
          api.fetchAdminUsers(),
          api.fetchAdminLinks()
        ]);
        setStats(statsRes.data || { totalUsers: 0, totalLinks: 0, totalClicks: 0 });
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setLinks(Array.isArray(linksRes.data) ? linksRes.data : []);
      } catch (err) {
        toast(err.response?.data?.message || 'Failed to load admin data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple/20 border-t-purple rounded-full animate-spin" />
        <p className="text-white/40 font-medium animate-pulse text-sm uppercase tracking-widest">Synchronizing Admin Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple/10 rounded-lg">
              <Shield size={24} className="text-purple-light" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-light">Core Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none">System <span className="text-purple-light">Admin</span></h1>
          <p className="text-white/40 text-sm mt-4 max-w-md">Global platform oversight, user management, and link analytics across the entire kkoneurl ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-primary bg-gradient-to-br from-purple/50 to-cyan/50 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="text-xs">
            <p className="text-white font-bold">Active Sessions</p>
            <p className="text-white/40">Real-time monitoring</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: User2, color: 'cyan', gradient: 'from-cyan/20 to-transparent' },
          { label: 'Total Links', value: stats.totalLinks, icon: Link2, color: 'green', gradient: 'from-green/20 to-transparent' },
          { label: 'Total Clicks', value: stats.totalClicks, icon: MousePointerClick, color: 'purple-light', gradient: 'from-purple/20 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className={`card group relative overflow-hidden bg-gradient-to-br ${stat.gradient} border-white/5 hover:border-white/10 transition-all duration-500`}>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
              <stat.icon size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl bg-${stat.color}/10 text-${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              </div>
              <p className="text-4xl font-black tracking-tighter text-white">{stat.value?.toLocaleString() || 0}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30">
                <Activity size={12} className="text-green" />
                <span>+12% from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User2 size={20} className="text-cyan" />
            <h2 className="text-xl font-black font-display tracking-tight text-white">Registered Users</h2>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 border border-white/5">
            {users.length} Total
          </span>
        </div>
        
        <div className="card !p-0 overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-white/30 border-b border-white/5 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-5">Member</th>
                  <th className="px-6 py-5 text-center">Username</th>
                  <th className="px-6 py-5 text-center">Access Level</th>
                  <th className="px-6 py-5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white/60">
                          {u.display_name?.[0] || u.email?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.display_name || 'Anonymous User'}</p>
                          <p className="text-xs text-white/30">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-white/5 rounded text-white/60 text-xs font-mono">
                        {u.username ? `@${u.username}` : 'not set'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 text-purple-light text-[10px] font-black uppercase">
                          <Shield size={12} /> Root Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase">
                          Standard User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-white/40 font-medium">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Users View */}
          <div className="md:hidden divide-y divide-white/5">
            {users.map((u) => (
              <div key={u.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white/60 flex-shrink-0">
                    {u.display_name?.[0] || u.email?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-sm">{u.display_name || 'Anonymous'}</p>
                    <p className="text-[10px] text-white/30 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {u.is_admin && <Shield size={14} className="text-purple-light" />}
                  <span className="text-[10px] text-white/30 font-medium">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 size={20} className="text-green" />
            <h2 className="text-xl font-black font-display tracking-tight text-white">System-wide Links</h2>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 border border-white/5">
            {links.length} Links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((l) => (
            <div key={l.id} className="card bg-white/[0.02] border-white/5 group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-purple-light transition-colors">
                  <Globe size={18} />
                </div>
                {l.is_active ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green/10 text-green text-[10px] font-black uppercase">
                    <CheckCircle2 size={10} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red/10 text-red text-[10px] font-black uppercase">
                    <AlertCircle size={10} /> Disabled
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white mb-1 truncate pr-4">{l.title || 'Untitled Link'}</h4>
              <p className="text-xs text-white/30 mb-6 font-mono truncate">{l.short_code}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="text-[10px]">
                    <p className="text-white font-bold">{l.clicks || 0}</p>
                    <p className="text-white/20 uppercase tracking-widest">Clicks</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                  <Calendar size={10} />
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
