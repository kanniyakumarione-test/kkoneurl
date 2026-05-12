import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, Globe, Smartphone, Monitor, Tablet, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#6c63ff', '#00d4ff', '#43e97b', '#ff6584', '#ff9a3c'];

const Analytics = ({ links }) => {
  const safeLinks = Array.isArray(links) ? links : [];
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState('');
  const trendChartRef = useRef(null);
  const [trendChartReady, setTrendChartReady] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelected(id);
    } else if (safeLinks[0]) {
      setSelected(safeLinks[0]._id || safeLinks[0].id);
    }
  }, [searchParams, safeLinks]);

  useEffect(() => {
    const el = trendChartRef.current;
    if (!el) return undefined;

    const updateReady = () => {
      const { width, height } = el.getBoundingClientRect();
      setTrendChartReady(width > 0 && height > 0);
    };

    updateReady();
    const observer = new ResizeObserver(updateReady);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const link = safeLinks.find(l => (l._id || l.id) === selected) || safeLinks[0];

  if (!link) return <div className="p-20 text-center text-white/40 font-bold">No links to analyze.</div>;

  const deviceStats = link.device_stats || link.deviceStats || { mobile: 0, desktop: 0, tablet: 0 };
  const geoStats = link.geo_stats || link.geoStats || {};
  const browserStats = link.browser_stats || link.browserStats || {};
  const dailyClicks = link.daily_clicks || link.dailyClicks || [];

  const deviceData = [
    { name: 'Mobile', value: deviceStats.mobile || 0 },
    { name: 'Desktop', value: deviceStats.desktop || 0 },
    { name: 'Tablet', value: deviceStats.tablet || 0 },
  ];

  const geoData = Object.entries(geoStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([country, clicks]) => ({ country, clicks }));

  const browserData = Object.entries(browserStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight mb-2">Analytics</h1>
          <p className="text-white/40 text-sm">Deep insights for your short links</p>
        </div>
        <select
          className="input !w-auto min-w-[240px] !bg-bg-card border-white/5"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {safeLinks.map(l => (
            <option key={l._id} value={l._id}>{l.title || l.shortCode}</option>
          ))}
        </select>
      </div>

      {/* Link Banner */}
      <div className="card !bg-gradient-to-br from-bg-card to-bg-secondary border-purple/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple to-cyan rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-purple/20">
          {link.title?.[0] || '🔗'}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold mb-1">{link.title || link.short_code}</h2>
          <p className="text-purple-light font-bold">kkoneurl.kanniyakumarione.com/{link.short_code}</p>
        </div>
        <div className="flex items-center gap-8 px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
          {[
            { val: link.clicks || 0, label: 'Clicks' },
            { val: link.unique_clicks || link.uniqueClicks || 0, label: 'Unique' },
            { val: (link.clicks > 0) ? `${Math.round(((link.unique_clicks || link.uniqueClicks || 0)/link.clicks)*100)}%` : '0%', label: 'CTR' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-black font-display">{s.val.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold">Click Trend</h3>
            <span className="badge bg-green/10 text-green"><TrendingUp size={12} /> +14.2%</span>
          </div>
          <div ref={trendChartRef} style={{ height: 220, width: '100%', minHeight: 220, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              {trendChartReady ? (
                <AreaChart data={dailyClicks}>
                  <defs>
                    <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c63ff" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6c63ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#6c63ff" strokeWidth={3} fill="url(#aG)" />
                </AreaChart>
              ) : null}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geo */}
        <div className="card">
          <div className="flex items-center gap-2 mb-8">
            <Globe size={18} className="text-cyan" />
            <h3 className="font-bold">Top Countries</h3>
          </div>
          <div className="space-y-4">
            {geoData.length > 0 ? geoData.map((g, i) => (
              <div key={g.country}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">{g.country}</span>
                  <span className="font-black">{g.clicks.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ 
                      width: geoData[0] ? `${Math.round((g.clicks / geoData[0].clicks) * 100)}%` : '0%',
                      backgroundColor: COLORS[i % COLORS.length]
                    }} 
                  />
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-white/20 text-xs font-black uppercase tracking-widest">No geographic data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
