import { useState, useMemo, useRef, useEffect } from 'react';
import {
  TrendingUp, Link2, MousePointerClick, Users,
  ArrowUpRight, Clock, Copy, ExternalLink, BarChart3, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from '../context/ToastContext';

const StatCard = ({ icon, label, value, change, color, borderColor }) => (
  <div className={`card relative overflow-hidden group hover:bg-bg-hover`}>
    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderColor}`} />
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-${color}`}>
        {icon}
      </div>
      {change !== 0 && (
        <span className={`badge ${change >= 0 ? 'bg-green/10 text-green' : 'bg-pink/10 text-pink'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div className="text-3xl font-black font-display tracking-tight mb-1">{value.toLocaleString()}</div>
    <div className="text-sm text-white/40 font-medium">{label}</div>
  </div>
);

const Dashboard = ({ links }) => {
  const { profile } = useAuth();
  const safeLinks = Array.isArray(links) ? links : [];

  const toast = useToast();
  const [period, setPeriod] = useState('7d');
  const chartContainerRef = useRef(null);
  const [chartReady, setChartReady] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return undefined;

    const updateReady = () => {
      const { width, height } = el.getBoundingClientRect();
      setChartReady(width > 0 && height > 0);
      setChartWidth(Math.max(0, Math.floor(width)));
    };

    updateReady();
    const observer = new ResizeObserver(updateReady);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalClicks = useMemo(() => safeLinks.reduce((s, l) => s + (l.clicks || 0), 0), [safeLinks]);
  const totalUnique = useMemo(() => safeLinks.reduce((s, l) => s + (l.unique_clicks || 0), 0), [safeLinks]);
  
  const chartData = useMemo(() => {
    const map = {};
    safeLinks.forEach(link => {
      const clicks = link.daily_clicks || link.dailyClicks || [];
      clicks.forEach(d => {
        map[d.date] = (map[d.date] || 0) + d.clicks;
      });
    });
    const sorted = Object.entries(map)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return sorted.length > 0 ? sorted : [{ date: new Date().toISOString().split('T')[0], clicks: 0 }];
  }, [safeLinks]);

  const topLinks = [...safeLinks].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black font-display tracking-tight">Dashboard</h1>
            {profile?.plan === 'pro' && (
              <span className="bg-purple/20 text-purple-light text-[10px] font-black px-3 py-1 rounded-full border border-purple/30 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} /> Pro
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm">Welcome back! Tracking {safeLinks.length} active links.</p>
        </div>

        <div className="flex bg-bg-card border border-white/10 p-1 rounded-xl">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-purple text-white shadow-lg shadow-purple/20' : 'text-white/40 hover:text-white'}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MousePointerClick size={20} />} label="Total Clicks" value={totalClicks} change={0} color="purple" borderColor="from-purple to-purple-light" />
        <StatCard icon={<Users size={20} />} label="Unique Visitors" value={totalUnique} change={0} color="cyan" borderColor="from-cyan to-purple" />
        <StatCard icon={<Link2 size={20} />} label="Active Links" value={safeLinks.length} change={0} color="green" borderColor="from-green to-cyan" />
        <StatCard icon={<TrendingUp size={20} />} label="Avg. CTR" value={safeLinks.length ? ((totalClicks / (safeLinks.length * 100)) * 100).toFixed(1) + '%' : '0%'} change={0} color="pink" borderColor="from-pink to-orange" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold">Click Traffic</h3>
              <p className="text-xs text-white/30">Last 7 days data</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple rounded-full animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Realtime</span>
            </div>
          </div>
          <div ref={chartContainerRef} style={{ height: 240, width: '100%', minHeight: 240, minWidth: 0 }}>
            {chartReady && chartWidth > 0 ? (
              <AreaChart width={chartWidth} height={240} data={chartData}>
                  <defs>
                    <linearGradient id="pgrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#9b94ff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#6c63ff" strokeWidth={3} fillOpacity={1} fill="url(#pgrad)" />
                </AreaChart>
            ) : null}
          </div>
        </div>

        {/* Top Links */}
        <div className="card">
          <h3 className="font-bold mb-6">Top Links</h3>
          <div className="space-y-4">
            {topLinks.map((link, i) => (
              <div key={link.id} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black text-white/20 group-hover:text-purple transition-colors">
                  #{i + 1}
                </div>
                <div className="flex-1 min-width-0">
                  <p className="text-sm font-bold truncate">{link.title || link.short_code}</p>
                  <p className="text-[11px] text-purple-light/70 truncate">kkoneurl.kanniyakumarione.com/{link.short_code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">{(link.clicks || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">clicks</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-xs font-bold text-white/30 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest">
            View All Links
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
