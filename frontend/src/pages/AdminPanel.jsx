import { useEffect, useState } from 'react';
import { Shield, Mail, User2, Link2, MousePointerClick } from 'lucide-react';
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
    return <div className="h-[60vh] flex items-center justify-center text-white/60">Loading admin data...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight mb-2">Admin Panel</h1>
        <p className="text-white/40 text-sm">Platform-wide visibility for admin users.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <User2 size={18} className="text-cyan" />
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Total Users</p>
          </div>
          <p className="text-2xl font-black">{stats.totalUsers || 0}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Link2 size={18} className="text-green" />
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Total Links</p>
          </div>
          <p className="text-2xl font-black">{stats.totalLinks || 0}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <MousePointerClick size={18} className="text-purple-light" />
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Total Clicks</p>
          </div>
          <p className="text-2xl font-black">{stats.totalClicks || 0}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-purple-light" />
          <h3 className="font-bold">Users</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Display Name</th>
                <th className="py-2 pr-4">Username</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.display_name || '-'}</td>
                  <td className="py-2 pr-4">{u.username || '-'}</td>
                  <td className="py-2 pr-4">{u.is_admin ? 'Admin' : 'User'}</td>
                  <td className="py-2 pr-4">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-cyan" />
          <h3 className="font-bold">All Links</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="py-2 pr-4">Short Code</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Clicks</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{l.short_code}</td>
                  <td className="py-2 pr-4">{l.title || '-'}</td>
                  <td className="py-2 pr-4">{l.clicks || 0}</td>
                  <td className="py-2 pr-4">{l.is_active ? 'Active' : 'Disabled'}</td>
                  <td className="py-2 pr-4">{l.created_at ? new Date(l.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
