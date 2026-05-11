import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Link2, BarChart3, QrCode, Globe,
  Smartphone, ChevronRight, Star, Users, Activity, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

const FEATURES = [
  { icon: <Link2 size={22} />, color: 'text-purple', bg: 'bg-purple/10', title: 'Smart Slugs', desc: 'AI-generated memorable short URLs, not random gibberish.' },
  { icon: <BarChart3 size={22} />, color: 'text-cyan', bg: 'bg-cyan/10', title: 'Deep Analytics', desc: 'Real-time clicks, geo heatmap, device & browser breakdown.' },
  { icon: <QrCode size={22} />, color: 'text-green', bg: 'bg-green/10', title: 'QR Generator', desc: 'Download branded QR codes for every link in seconds.' },
  { icon: <Globe size={22} />, color: 'text-orange', bg: 'bg-orange/10', title: 'Geo Redirects', desc: 'Send users to different URLs based on their country.' },
  { icon: <Smartphone size={22} />, color: 'text-pink', bg: 'bg-pink/10', title: 'Device Routing', desc: 'iOS → App Store, Android → Play Store automatically.' },
  { icon: <Shield size={22} />, color: 'text-purple-light', bg: 'bg-purple-light/10', title: 'Link Password', desc: 'Protect sensitive links with a password gate.' },
];

const Landing = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortened, setShortened] = useState('');
  const [copied, setCopied] = useState(false);
  const [globalStats, setGlobalStats] = useState({ totalLinks: '1.2k+', totalClicks: '45k+', activeUsers: '850+' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.fetchGlobalStats();
        setGlobalStats({
          totalLinks: (data.totalLinks || 0).toLocaleString() + '+',
          totalClicks: ((data.totalClicks || 0) / 1000).toFixed(1) + 'k+',
          activeUsers: (data.activeUsers || 0).toLocaleString() + '+'
        });
      } catch (err) {
        console.error('Failed to load stats');
      }
    };
    loadStats();
  }, []);

  const dynamicStats = [
    { icon: <Activity size={20} />, value: globalStats.totalLinks, label: 'Links Created' },
    { icon: <Users size={20} />, value: globalStats.activeUsers, label: 'Active Users' },
    { icon: <BarChart3 size={20} />, value: globalStats.totalClicks, label: 'Total Clicks' },
    { icon: <Star size={20} />, value: '4.9★', label: 'User Rating' },
  ];

  const handleShorten = async () => {
    if (!url.trim()) return;
    
    if (!user) {
      // Redirect to login but keep the URL in state to shorten after login
      navigate('/login', { state: { pendingUrl: url } });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.createLink({ originalUrl: url });
      const baseUrl = window.location.origin.replace('https://', '').replace('http://', '');
      setShortened(`${baseUrl}/${data.shortCode}`);
    } catch (err) {
      console.error('Shorten error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden relative text-[#f0f0ff]">
      <div className="fixed top-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[100px] left-[-200px] w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-bg-primary/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple to-purple-dark rounded-lg flex items-center justify-center shadow-lg shadow-purple/20">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <span className="font-display text-xl font-bold">kkone<span className="text-purple-light">url</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-bg-secondary/60">
            {['Features', 'Stats', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-white/70 hover:text-white" onClick={() => navigate('/dashboard')}>Login</button>
            <button className="btn btn-primary !py-2 !px-4 text-sm" onClick={() => navigate('/dashboard')}>
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-purple-light text-xs font-bold mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
          Next-gen URL shortener for creators & brands
        </div>

        <h1 className="text-5xl md:text-8xl font-black font-display leading-[0.9] tracking-tighter mb-8">
          Shorten. Track.<br />
          <span className="gradient-text">Dominate.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
          kkoneurl gives your links superpowers — real-time analytics, QR codes, geo-redirects, and stunning bio pages.
        </p>

        <div className="max-w-2xl mx-auto mb-20">
          {!shortened ? (
            <div className="flex items-center gap-2 p-2 pl-5 bg-bg-card border border-white/10 rounded-2xl focus-within:border-purple focus-within:ring-4 focus-within:ring-purple/10 transition-all shadow-2xl">
              <Link2 size={20} className="text-white/40 shrink-0" />
              <input
                className="bg-transparent border-none outline-none text-white w-full py-3 placeholder:text-white/20"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleShorten()}
              />
              <button 
                className={`btn btn-primary !rounded-xl ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleShorten}
              >
                {loading ? '...' : <>Shorten <Zap size={16} /></>}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-bg-card border border-purple/30 rounded-2xl shadow-glow animate-fade-in">
              <div className="flex-1 text-left px-2">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">Your link is ready</p>
                <p className="text-xl font-bold text-purple-light leading-none">{shortened}</p>
              </div>
              <button 
                className={`btn ${copied ? 'bg-green/20 text-green border-green/30' : 'btn-primary'} !py-2 !px-6 !rounded-xl text-sm`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button className="p-3 text-white/40 hover:text-white transition-colors" onClick={() => {setShortened(''); setUrl('');}}>
                <Zap size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/5 bg-bg-secondary/30 backdrop-blur-sm">
          {dynamicStats.map((s, i) => (
            <div key={i} className="p-8 border-x border-white/5 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
              <div className="text-purple-light mb-2">{s.icon}</div>
              <div className="text-3xl font-black font-display tracking-tight text-white">{s.value}</div>
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="badge !bg-purple/10 !text-purple-light border border-purple/20 mb-4">FEATURES</span>
          <h2 className="text-4xl font-bold font-display tracking-tight mb-4">Everything your links need</h2>
          <p className="text-white/50">Built for creators, marketers, and growing brands.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="card group hover:scale-[1.02]">
              <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 bg-bg-secondary/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Zap size={18} fill="#6c63ff" className="text-purple" />
            <span className="font-display font-bold text-xl">kkone<span className="text-purple-light">url</span></span>
          </div>
          <p className="text-white/30 text-sm text-center">© 2026 kkoneurl — Built with ❤️ for the KK One platform</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
