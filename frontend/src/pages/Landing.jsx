import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Link2, BarChart3, QrCode, Globe,
  Smartphone, ChevronRight, Star, Users, Activity, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "KKOneURL | Professional URL Shortener & Analytics Platform";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Shorten, track, and optimize your links with real-time analytics, QR codes, and device-based routing.");
  }, []);

  const handleShorten = () => {
    if (!url.trim()) return;
    if (!user) {
      navigate('/login', { state: { pendingUrl: url } });
    } else {
      navigate('/links', { state: { pendingUrl: url } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] overflow-x-hidden relative text-[#f0f0ff] selection:bg-purple/30">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-cyan/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 border-b border-white/5 bg-[#0a0a10]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple to-purple-dark rounded-xl flex items-center justify-center shadow-lg shadow-purple/20 group-hover:scale-110 transition-transform">
              <Zap size={16} fill="white" className="text-white md:w-5 md:h-5" />
            </div>
            <span className="font-display text-xl md:text-2xl font-black tracking-tight">kkone<span className="text-purple-light">url</span></span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button className="btn btn-primary !py-2 md:!py-3 !px-5 md:!px-8 !text-xs md:!text-sm shadow-glow" onClick={() => navigate('/links')}>
                Dashboard <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary !py-2 md:!py-3 !px-5 md:!px-8 !text-xs md:!text-sm shadow-glow" onClick={() => navigate('/login')}>
                Get Started <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* 🚀 Hero Section */}
        <section className="relative pt-28 md:pt-44 pb-16 md:pb-32 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-purple/10 border border-purple/20 text-purple-light text-[10px] md:text-xs font-black uppercase tracking-[0.18em] md:tracking-widest mb-7 md:mb-10 animate-fade-in shadow-2xl">
                <span className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_10px_#43e97b]" />
                Next-gen platform for modern brands
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-display leading-[0.9] md:leading-[0.85] tracking-tighter mb-6 md:mb-8">
                Build. Scale.<br />
                <span className="gradient-text drop-shadow-[0_0_30px_rgba(108,99,255,0.3)]">Dominate.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-2xl text-white/40 max-w-2xl lg:mx-0 mx-auto mb-8 md:mb-12 leading-relaxed font-medium px-1 sm:px-0">
                KKOneURL transforms simple links into high-performance marketing assets with real-time analytics and smart routing.
              </p>

              <div className="max-w-xl lg:mx-0 mx-auto group">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:pl-6 bg-white/5 border border-white/10 rounded-[24px] focus-within:border-purple/50 focus-within:ring-4 focus-within:ring-purple/10 transition-all shadow-2xl backdrop-blur-md">
                  <Link2 size={20} className="text-white/20 shrink-0 hidden sm:block" />
                  <input
                    className="bg-transparent border-none outline-none text-white w-full text-base md:text-lg placeholder:text-white/15 font-medium px-2 sm:px-0"
                    placeholder="Paste your long link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  />
                  <button
                    className="bg-purple hover:bg-purple-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-lg shadow-purple/30 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                    onClick={handleShorten}
                  >
                    Shorten <Zap size={16} fill="white" />
                  </button>
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 grayscale opacity-30">
                <div className="text-[10px] sm:text-sm font-black uppercase tracking-[0.18em] sm:tracking-widest text-white/40">Trusted by</div>
                <div className="flex gap-4 sm:gap-8 font-display font-black text-base sm:text-xl italic flex-wrap justify-center">
                  <span>VELOCITY</span>
                  <span>PRIME</span>
                  <span>QUANTUM</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-float mt-2 md:mt-0">
              {/* Floating UI Preview */}
              <div className="relative bg-bg-card border border-white/10 rounded-[28px] md:rounded-[40px] p-5 md:p-8 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple/20 rounded-2xl flex items-center justify-center text-purple">
                      <BarChart3 size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base md:text-lg">Real-time Stats</h4>
                      <p className="text-xs text-white/20">Link activity last 24h</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green/10 text-green text-[10px] font-black uppercase tracking-widest border border-green/20">Active</div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: 'Total Clicks', val: '24.5k', color: 'bg-purple', w: 'w-full' },
                    { label: 'Unique Visitors', val: '18.2k', color: 'bg-cyan', w: 'w-3/4' },
                    { label: 'Avg. CTR', val: '4.2%', color: 'bg-pink', w: 'w-1/2' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                        <span className="text-white/40">{s.label}</span>
                        <span>{s.val}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full ${s.w} shadow-glow`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center"><QrCode size={18} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Branded QR Code</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/10 rounded-full" />)}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/20" />
                </div>
              </div>
              
              {/* Decorative Glow behind UI */}
              <div className="absolute inset-0 bg-purple/20 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </section>

        {/* 🛠️ Features Grid */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight mb-6">Everything you need<br /><span className="text-white/20">for link management.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-8 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.05] hover:border-white/10 transition-all hover:-translate-y-2">
                <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 📊 Global Stats */}
        <section id="stats" className="py-32 bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Links Shortened', val: '12M+' },
                { label: 'Clicks Tracked', val: '450M+' },
                { label: 'Active Brands', val: '2.5k+' },
                { label: 'Uptime', val: '99.9%' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-6xl font-black font-display mb-2 gradient-text">{s.val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-44 px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-12">
            Ready to give your<br />links superpowers?
          </h2>
          <button
            className="btn btn-primary !py-5 !px-12 !text-lg shadow-glow hover:scale-105 transition-all"
            onClick={() => navigate(user ? '/dashboard' : '/login')}
          >
            {user ? 'Dashboard' : 'Start for Free'} <ArrowRight size={20} />
          </button>
          <p className="mt-8 text-white/20 text-sm font-medium">No credit card required • Unlimited standard links</p>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-purple" />
            <span className="font-display font-black text-white/40 tracking-tight">KKONEURL © 2024</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/api-docs" className="hover:text-white transition-colors">API Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
