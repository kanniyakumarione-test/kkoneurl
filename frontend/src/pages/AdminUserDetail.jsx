import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, User2, Link2, MousePointerClick, 
  Activity, Globe, Calendar, CheckCircle2, 
  AlertCircle, Sparkles, Ban, CheckCircle, 
  Search, TrendingUp, DollarSign, Eye, X, 
  Flame, ExternalLink, Trash2, UserMinus, 
  ChevronLeft, ArrowLeft
} from 'lucide-react';
import * as api from '../api';
import { useToast } from '../context/ToastContext';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Fetch all users to find this one (since we don't have a single user admin fetch yet)
        const usersRes = await api.fetchAdminUsers();
        const foundUser = usersRes.data.find(u => u.id === id);
        
        if (!foundUser) {
          toast('User not found', 'error');
          navigate('/admin');
          return;
        }
        
        setUser(foundUser);

        // Fetch all links and filter for this user
        const linksRes = await api.fetchAdminLinks();
        const filteredLinks = linksRes.data.filter(l => l.user_id === id);
        setUserLinks(filteredLinks);

        const totalClicks = filteredLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
        setStats({ totalLinks: filteredLinks.length, totalClicks });

      } catch (err) {
        toast('Failed to load user management data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id, navigate, toast]);

  const handleDeleteUser = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this user and ALL their links? This cannot be undone.')) return;
    try {
      await api.adminDeleteUser(id);
      toast('User purged successfully!', 'success');
      navigate('/admin');
    } catch (err) {
      toast('Failed to delete user', 'error');
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await api.adminDeleteLink(linkId);
      setUserLinks(prev => prev.filter(l => l.id !== linkId));
      setStats(prev => ({ ...prev, totalLinks: prev.totalLinks - 1 }));
      toast('Link removed from system', 'success');
    } catch (err) {
      toast('Failed to delete link', 'error');
    }
  };

  const handleToggleVerify = async () => {
    try {
      await api.toggleUserVerify(id);
      setUser(prev => ({ ...prev, is_verified: !prev.is_verified }));
      toast('Verification status updated', 'success');
    } catch (err) {
      toast('Failed to update verification', 'error');
    }
  };

  const handleToggleBan = async () => {
    try {
      await api.toggleUserBan(id);
      setUser(prev => ({ ...prev, is_banned: !prev.is_banned }));
      toast(user.is_banned ? 'User unbanned' : 'User banned', 'success');
    } catch (err) {
      toast('Failed to update ban status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple/20 border-t-purple rounded-full animate-spin" />
        <p className="text-white/40 font-medium animate-pulse text-sm uppercase tracking-widest">Accessing Secure Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Breadcrumbs */}
      <button 
        onClick={() => navigate('/admin')}
        className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-6"
      >
        <div className="p-2 bg-white/5 rounded-xl group-hover:bg-purple/10 group-hover:text-purple-light transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.2em]">Back to System Admin</span>
      </button>

      {/* Header Profile Section */}
      <div className="relative overflow-hidden card !p-10 bg-gradient-to-br from-purple/10 via-transparent to-transparent border-white/10">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <User2 size={200} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-purple to-purple-light flex items-center justify-center font-black text-4xl md:text-5xl text-white shadow-3xl shadow-purple/20 ring-4 ring-white/5">
              {user.display_name?.[0] || user.email?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-none">
                  {user.display_name || 'Anonymous'}
                </h1>
                {user.is_verified && (
                  <div className="p-1.5 bg-cyan/10 rounded-full border border-cyan/20">
                    <CheckCircle size={20} className="text-cyan" />
                  </div>
                )}
              </div>
              <p className="text-white/40 text-lg flex items-center gap-3 font-medium">
                <Mail size={18} className="text-purple-light/40" /> {user.email}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.is_banned ? 'bg-red/10 border-red/30 text-red' : 'bg-green/10 border-green/30 text-green'}`}>
                  {user.is_banned ? 'Status: BANNED' : 'Status: ACTIVE'}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <button 
              onClick={handleToggleVerify}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-xs uppercase tracking-widest active:scale-95 hover:scale-105 shadow-glow-sm hover:shadow-cyan/20 ${user.is_verified ? 'bg-cyan/10 border-cyan/30 text-cyan' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}
            >
              <CheckCircle size={16} /> {user.is_verified ? 'Unverify' : 'Verify User'}
            </button>
            <button 
              onClick={handleToggleBan}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-xs uppercase tracking-widest active:scale-95 hover:scale-105 shadow-glow-sm hover:shadow-red/20 ${user.is_banned ? 'bg-green/10 border-green/30 text-green' : 'bg-red/10 border-red/30 text-red'}`}
            >
              <Ban size={16} /> {user.is_banned ? 'Unban User' : 'Ban User'}
            </button>
            <button 
              onClick={handleDeleteUser}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red/10 border border-red/20 text-red rounded-2xl hover:bg-red hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest active:scale-95 hover:scale-105 hover:shadow-lg hover:shadow-red/30"
            >
              <UserMinus size={16} /> Purge Account
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Current Subscription', value: user.plan || 'Free', color: 'purple-light', icon: Sparkles, gradient: 'from-purple/20' },
          { label: 'Total Links Created', value: stats.totalLinks, color: 'cyan', icon: Link2, gradient: 'from-cyan/20' },
          { label: 'Cumulative Engagement', value: stats.totalClicks, color: 'green', icon: MousePointerClick, gradient: 'from-green/20' },
        ].map((stat, i) => (
          <div key={i} className={`card group overflow-hidden bg-gradient-to-br ${stat.gradient} to-transparent border-white/5`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{stat.label}</p>
            </div>
            <p className="text-4xl font-black text-white uppercase">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Protocol Assets (Links) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <Activity size={20} className="text-purple-light" />
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">Protocol Assets</h2>
          </div>
          <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 rounded-full text-white/30 border border-white/5 uppercase tracking-widest">
            {userLinks.length} Active Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {userLinks.map(l => (
            <div key={l.id} className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/[0.04] hover:border-purple/20 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple/5 transition-all duration-500">
              <div className="flex items-center gap-6 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-purple-light group-hover:bg-purple/10 transition-all flex-shrink-0">
                  <Globe size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white text-xl truncate mb-1">{l.title || 'Untitled Link'}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-white/20 font-mono truncate max-w-md">
                      <span className="text-purple-light/40">kkoneurl.com/</span>{l.short_code}
                    </p>
                    <p className="text-[10px] text-white/10 truncate max-w-md font-medium">{l.original_url}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10">
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{l.clicks || 0}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Total Engagement</p>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={l.original_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-4 bg-white/5 rounded-[1.25rem] hover:bg-purple/10 hover:text-purple-light transition-all border border-white/5 text-white/20"
                    title="Audit Destination"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button 
                    onClick={() => handleDeleteLink(l.id)}
                    className="p-4 bg-white/5 rounded-[1.25rem] hover:bg-red/10 hover:text-red transition-all border border-white/5 text-white/20"
                    title="Destroy Node"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {userLinks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[4rem]">
              <div className="p-8 bg-white/5 rounded-full mb-6">
                <Link2 size={48} className="text-white/10" />
              </div>
              <p className="text-white/20 text-lg italic font-medium">User has not initialized any data protocol nodes.</p>
            </div>
          )}
        </div>
      </section>

      {/* Security Footer */}
      <div className="mt-20 pt-10 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 flex items-center justify-center gap-4">
          <Shield size={12} /> SECURE ADMINISTRATIVE MANAGEMENT INTERFACE <Shield size={12} />
        </p>
      </div>
    </div>
  );
};

export default AdminUserDetail;
