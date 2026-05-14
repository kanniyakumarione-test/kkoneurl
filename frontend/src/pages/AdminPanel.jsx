import { useEffect, useState } from 'react';
import { Shield, Mail, User2, Link2, MousePointerClick, Activity, Globe, Calendar, CheckCircle2, AlertCircle, Sparkles, Ban, CheckCircle, Search, TrendingUp, DollarSign, Eye, X, Flame, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import * as api from '../api';
import { useToast } from '../context/ToastContext';

const AdminPanel = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalLinks: 0, totalClicks: 0, totalPro: 0 });
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, linksRes, growthRes] = await Promise.all([
          api.fetchAdminStats(),
          api.fetchAdminUsers(),
          api.fetchAdminLinks(),
          api.fetchGrowthStats()
        ]);
        setStats(statsRes.data || { totalUsers: 0, totalLinks: 0, totalClicks: 0, totalPro: 0 });
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setLinks(Array.isArray(linksRes.data) ? linksRes.data : []);
        setGrowthData(growthRes.data || []);
      } catch (err) {
        toast(err.response?.data?.message || 'Failed to load admin data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [toast]);

  const handleTogglePlan = async (user) => {
    const newPlan = user.plan === 'pro' ? 'free' : 'pro';
    try {
      await api.updateUserPlan(user.id, newPlan);
      setUsers(users.map(u => u.id === user.id ? { ...u, plan: newPlan } : u));
      toast(`User plan updated to ${newPlan.toUpperCase()}! ✨`, 'success');
    } catch (err) {
      toast('Failed to update user plan', 'error');
    }
  };

  const handleToggleBan = async (user) => {
    try {
      await api.toggleUserBan(user.id);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_banned: !u.is_banned } : u));
      toast(user.is_banned ? 'User unbanned' : 'User banned', 'success');
    } catch (err) {
      toast('Failed to update ban status', 'error');
    }
  };

  const handleToggleVerify = async (user) => {
    try {
      await api.toggleUserVerify(user.id);
      setUsers(users.map(u => u.id === user.id ? { ...u, is_verified: !u.is_verified } : u));
      toast('Verification status updated', 'success');
    } catch (err) {
      toast('Failed to update verification', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const revenue = stats.totalPro * 9.99; // Assume $9.99/mo

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
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: User2, color: 'cyan', gradient: 'from-cyan/20 to-transparent' },
          { label: 'Total Links', value: stats.totalLinks, icon: Link2, color: 'green', gradient: 'from-green/20 to-transparent' },
          { label: 'Total Clicks', value: stats.totalClicks, icon: MousePointerClick, color: 'purple-light', gradient: 'from-purple/20 to-transparent' },
          { label: 'Est. Monthly Revenue', value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: 'pink', gradient: 'from-pink/20 to-transparent' },
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
              <div className="mt-4 flex items-center gap-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                <span className="text-white/30 uppercase tracking-widest font-bold">Live Synchronized</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="card !p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black font-display flex items-center gap-2">
              <TrendingUp className="text-cyan" /> Platform Growth
            </h3>
            <p className="text-xs text-white/40 mt-1">Daily user registrations (Last 30 Days)</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan" />
                <span className="text-[10px] font-bold text-white/40 uppercase">New Users</span>
             </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#00d4ff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="count" stroke="#00d4ff" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <User2 size={20} className="text-cyan" />
            <h2 className="text-xl font-black font-display tracking-tight text-white">Registered Users</h2>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                className="input !pl-12 !py-2 !text-xs" 
                placeholder="Search email, username..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 border border-white/5 whitespace-nowrap">
              {filteredUsers.length} Results
            </span>
          </div>
        </div>
        
        <div className="card !p-0 overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-white/30 border-b border-white/5 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-5">Member</th>
                  <th className="px-6 py-5 text-center">Subscription</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                  <th className="px-6 py-5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white/60 relative">
                          {u.display_name?.[0] || u.email?.[0] || '?'}
                          {u.is_verified && (
                            <div className="absolute -top-1 -right-1 bg-cyan text-white p-0.5 rounded-full border-2 border-bg-card">
                              <CheckCircle size={8} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {u.display_name || 'Anonymous'}
                            {u.is_admin && <Shield size={10} className="text-purple-light" />}
                          </p>
                          <p className="text-xs text-white/30">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleTogglePlan(u)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border transition-all ${u.plan === 'pro' ? 'bg-purple/10 border-purple/30 text-purple-light shadow-glow-sm' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                      >
                        {u.plan === 'pro' ? <Sparkles size={12} /> : null}
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.plan || 'free'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/10 text-red text-[10px] font-black uppercase">
                          <Ban size={10} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 text-green text-[10px] font-black uppercase">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleToggleVerify(u)}
                          className={`p-2 rounded-lg border transition-all ${u.is_verified ? 'bg-cyan/10 border-cyan/30 text-cyan' : 'bg-white/5 border-white/5 text-white/20 hover:text-white'}`}
                          title={u.is_verified ? "Unverify User" : "Verify User"}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          onClick={() => handleToggleBan(u)}
                          className={`p-2 rounded-lg border transition-all ${u.is_banned ? 'bg-red text-white border-red' : 'bg-white/5 border-white/5 text-white/20 hover:text-red hover:border-red/30'}`}
                          title={u.is_banned ? "Unban User" : "Ban User"}
                        >
                          <Ban size={14} />
                        </button>
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="p-2 rounded-lg border border-white/5 bg-white/5 text-white/20 hover:text-purple-light hover:bg-purple/10 hover:border-purple/30 transition-all"
                          title="View User Data"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
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
            <Flame size={20} className="text-orange-400" />
            <h2 className="text-xl font-black font-display tracking-tight text-white">Top 5 Global Trending</h2>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 border border-white/5">
            {links.length} Links
          </span>
        </div>

        <div className="card !p-0 overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-white/30 border-b border-white/5 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-5">Link Details</th>
                  <th className="px-6 py-5 text-center">Short Code</th>
                  <th className="px-6 py-5 text-center">Clicks</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {links
                  .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                  .slice(0, 5)
                  .map((l) => (
                  <tr key={l.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-purple-light transition-colors">
                          <Globe size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[200px]">{l.title || 'Untitled Link'}</p>
                          <p className="text-[10px] text-white/30 truncate max-w-[250px]">{l.original_url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-white/5 rounded text-white/60 text-xs font-mono">
                        {l.short_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-white">{l.clicks || 0}</span>
                        <span className="text-[9px] text-white/20 uppercase tracking-widest font-black">Engagement</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {l.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 text-green text-[10px] font-black uppercase">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/10 text-red text-[10px] font-black uppercase">
                          <AlertCircle size={10} /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-white/40 font-medium">
                      {l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Links View */}
          <div className="md:hidden divide-y divide-white/5">
            {links.map((l) => (
              <div key={l.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-white/5 rounded-lg text-white/40 flex-shrink-0">
                    <Globe size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-sm">{l.title || 'Untitled'}</p>
                    <p className="text-[10px] text-white/30 truncate font-mono">{l.short_code}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-bold text-white">{l.clicks || 0} clicks</span>
                  <div className={`w-2 h-2 rounded-full ${l.is_active ? 'bg-green' : 'bg-red'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="card max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border-white/10 shadow-3xl shadow-purple/10 animate-scale-in !p-0">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center font-bold text-xl text-purple-light">
                  {selectedUser.display_name?.[0] || selectedUser.email?.[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{selectedUser.display_name || 'Anonymous'}</h3>
                  <p className="text-white/40 text-sm font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-3 bg-white/5 rounded-2xl hover:bg-red/10 hover:text-red transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Account Plan</p>
                  <p className="text-xl font-black uppercase text-purple-light">{selectedUser.plan || 'Free'}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Total Links</p>
                  <p className="text-xl font-black">{links.filter(l => l.user_id === selectedUser.id).length}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Total Clicks</p>
                  <p className="text-xl font-black">{links.filter(l => l.user_id === selectedUser.id).reduce((sum, l) => sum + (l.clicks || 0), 0)}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white/40 uppercase tracking-[0.2em] font-black text-[10px]">
                  <Link2 size={12} /> <span>User Links Explorer</span>
                </div>
                <div className="space-y-4">
                  {links.filter(l => l.user_id === selectedUser.id).map(l => (
                    <div key={l.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-purple/30 transition-all">
                      <div className="min-w-0">
                        <p className="font-bold truncate max-w-[300px]">{l.title || 'Untitled'}</p>
                        <p className="text-[10px] text-white/20 font-mono truncate max-w-[400px]">kkoneurl.com/{l.short_code}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-black text-purple-light">{l.clicks || 0}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Clicks</p>
                        </div>
                        <a href={l.original_url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl hover:text-white transition-colors">
                          <ExternalLink size={16} className="opacity-40" />
                        </a>
                      </div>
                    </div>
                  ))}
                  {links.filter(l => l.user_id === selectedUser.id).length === 0 && (
                    <div className="text-center py-20 opacity-20 italic">No links created by this user yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
