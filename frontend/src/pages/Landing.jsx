import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Link2, BarChart3, QrCode, Globe,
  Smartphone, ChevronRight, Star, Users, Activity, Shield,
  CheckCircle2, MousePointerClick, MessageSquare, PlayCircle,
  HelpCircle, ChevronDown, Award, Globe2
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

const STEPS = [
  { icon: <Link2 className="text-purple" />, title: "Shorten", desc: "Paste your long URL and get a lightning-fast branded link instantly." },
  { icon: <Zap className="text-cyan" />, title: "Customize", desc: "Add custom slugs, passwords, and geo-targeting rules to your links." },
  { icon: <Activity className="text-green" />, title: "Dominate", desc: "Track every click in real-time with our enterprise-grade analytics suite." }
];

const FAQS = [
  { q: "Is KKOneURL free to use?", a: "Yes! We offer a powerful free plan that includes unlimited standard links and basic analytics. For advanced features like geo-targeting and custom domains, we offer a Pro plan." },
  { q: "How detailed are the analytics?", a: "Our analytics are enterprise-grade. You'll see real-time clicks, unique visitors, geographic location, device types, browser info, and referral sources." },
  { q: "Can I use custom slugs?", a: "Absolutely! You can customize the back-half of any link to make it memorable and on-brand for your audience." },
  { q: "Are the links permanent?", a: "Yes, standard links created on KKOneURL do not expire unless you set an expiration date (Pro feature) or delete them manually." }
];

const Landing = () => {
  const [url, setUrl] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // SEO: Dynamic Meta Tags
    document.title = "KKOneURL | #1 Professional URL Shortener & Marketing Analytics";
    
    const metas = {
      "description": "Shorten, track, and optimize your links with KKOneURL. The most powerful URL shortener with real-time analytics, branded QR codes, and smart geo-routing.",
      "keywords": "url shortener, link analytics, branded links, qr code generator, link management, geo targeting",
      "og:title": "KKOneURL | Build. Scale. Dominate.",
      "og:description": "Transform your links into high-performance marketing assets.",
      "twitter:card": "summary_large_image"
    };

    Object.entries(metas).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[${name.startsWith('og:') ? 'property' : 'name'}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // SEO: JSON-LD Schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "KKOneURL",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
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
    <div className="min-h-screen bg-[#07070f] overflow-x-hidden relative text-[#f0f0ff] selection:bg-purple/30">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-cyan/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 h-16 md:h-24 border-b border-white/5 bg-[#07070f]/60 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple to-purple-dark rounded-2xl flex items-center justify-center shadow-lg shadow-purple/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Zap size={20} fill="white" className="text-white md:w-6 md:h-6" />
            </div>
            <span className="font-display text-2xl md:text-3xl font-black tracking-tighter">kkone<span className="text-purple-light">url</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-primary !py-2.5 md:!py-4 !px-5 md:!px-8 !text-xs md:!text-sm shadow-glow active:scale-95 transition-all" 
              onClick={() => navigate(user ? '/dashboard' : '/login')}
            >
              {user ? 'Dashboard' : 'Launch App'} <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* 🚀 Hero Section */}
        <section className="relative pt-32 md:pt-56 pb-20 md:pb-40 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-purple-light text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10 animate-fade-in shadow-2xl backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
                </span>
                TRUSTED BY 10,000+ MODERN BRANDS
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black font-display leading-[0.85] tracking-tighter mb-8 md:mb-10">
                Build. Scale.<br />
                <span className="gradient-text drop-shadow-[0_0_40px_rgba(108,99,255,0.4)]">Dominate.</span>
              </h1>

              <p className="text-base sm:text-xl md:text-3xl text-white/30 max-w-2xl lg:mx-0 mx-auto mb-10 md:mb-16 leading-relaxed font-medium">
                The enterprise-grade link management platform for high-growth teams. Transform simple URLs into powerful marketing nodes.
              </p>

              <div className="max-w-2xl lg:mx-0 mx-auto group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple to-cyan rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-3 md:p-4 sm:pl-8 bg-bg-card border border-white/10 rounded-[28px] md:rounded-[30px] focus-within:border-purple/50 transition-all shadow-3xl backdrop-blur-xl">
                  <Link2 size={24} className="text-white/20 shrink-0 hidden sm:block" />
                  <input
                    className="bg-transparent border-none outline-none text-white w-full text-base md:text-xl placeholder:text-white/10 font-bold px-3 sm:px-0 py-2 sm:py-0"
                    placeholder="Shorten your destination URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  />
                  <button
                    className="bg-purple hover:bg-purple-dark text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple/40 active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap"
                    onClick={handleShorten}
                  >
                    Shorten <Zap size={20} fill="white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-float">
              {/* Floating UI Preview */}
              <div className="relative bg-[#13131f]/80 border border-white/10 rounded-[32px] md:rounded-[60px] p-6 md:p-12 shadow-3xl backdrop-blur-3xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-12">
                  <div className="flex gap-4 md:gap-5 items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-purple/10 rounded-2xl flex items-center justify-center text-purple shadow-inner">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg md:text-xl tracking-tight">Live Analytics</h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/20">Global Traffic Pulse</p>
                    </div>
                  </div>
                  <div className="px-3 md:px-4 py-1.5 rounded-full bg-green/10 text-green text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-green/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green rounded-full animate-ping" /> REAL-TIME
                  </div>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  {[
                    { label: 'Total Engagement', val: '128.4k', color: 'bg-purple', w: 'w-full' },
                    { label: 'Verified Traffic', val: '94.1k', color: 'bg-cyan', w: 'w-[85%]' },
                    { label: 'Conversion Velocity', val: '12.4%', color: 'bg-pink', w: 'w-[60%]' },
                  ].map((s) => (
                    <div key={s.label} className="group/stat">
                      <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2.5 md:mb-3">
                        <span className="text-white/30 group-hover/stat:text-white transition-colors">{s.label}</span>
                        <span className="text-white/60">{s.val}</span>
                      </div>
                      <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[1.5px] md:p-[2px]">
                        <div className={`h-full ${s.color} rounded-full ${s.w} shadow-[0_0_15px_rgba(108,99,255,0.5)] group-hover/stat:scale-x-105 transition-transform duration-700 origin-left`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 md:mt-14 p-5 md:p-6 rounded-[28px] md:rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center gap-5 md:gap-6 group/qr hover:bg-white/[0.06] transition-all cursor-pointer">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-white/20 group-hover/qr:text-purple transition-all"><QrCode size={20} className="md:w-[22px] md:h-[22px]" /></div>
                  <div className="flex-1">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/20 mb-1.5 md:mb-2 group-hover/qr:text-white/40">Branded Visual Protocol</p>
                    <div className="flex gap-1 md:gap-1.5">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/10 rounded-full group-hover/qr:bg-purple/40 transition-colors" />)}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/10 group-hover/qr:text-white group-hover/qr:translate-x-1 transition-all md:w-5 md:h-5" />
                </div>
              </div>
              
              {/* Decorative Glow behind UI */}
              <div className="absolute inset-0 bg-purple/10 blur-[150px] rounded-full -z-10 animate-pulse" />
            </div>
          </div>
        </section>

        {/* 🏢 Trust Bar */}
        <section className="py-20 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-20 grayscale hover:grayscale-0 hover:opacity-50 transition-all duration-700">
               {['TECHFLOW', 'NEXUS', 'APEX', 'VORTEX', 'SYNERGY', 'ORBIT'].map(brand => (
                 <span key={brand} className="font-display font-black text-2xl md:text-3xl tracking-tighter italic">{brand}</span>
               ))}
            </div>
          </div>
        </section>

        {/* 🛠️ Features Grid */}
        <section id="features" className="py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-32">
             <div className="inline-flex items-center gap-2 text-purple-light text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Award size={14} /> ELITE FEATURES FOR ELITE BRANDS
            </div>
            <h2 className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-8 leading-none">Everything you need<br /><span className="text-white/10">to dominate the web.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.04] hover:border-purple/30 transition-all duration-500 hover:-translate-y-3 shadow-2xl">
                <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-purple-light transition-colors">{f.title}</h3>
                <p className="text-white/30 text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🗺️ How it Works Section - SEO REACH Magnet */}
        <section id="how-it-works" className="py-40 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.05)_0,transparent_70%)]" />
           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-32">
                 <h2 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-6">Master the Link Life-Cycle</h2>
                 <p className="text-white/30 text-xl max-w-2xl mx-auto font-medium">Three simple steps to link perfection.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-16">
                 {STEPS.map((step, i) => (
                   <div key={i} className="relative text-center group">
                      {i < 2 && (
                        <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-purple/30 to-transparent -translate-x-12 z-0" />
                      )}
                      <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 relative z-10 group-hover:scale-110 group-hover:border-purple/50 transition-all duration-500 shadow-3xl backdrop-blur-xl">
                         <div className="scale-150 group-hover:scale-[1.7] transition-transform duration-500">{step.icon}</div>
                         <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg">0{i+1}</div>
                      </div>
                      <h3 className="text-3xl font-black mb-6 tracking-tight">{step.title}</h3>
                      <p className="text-white/30 font-medium leading-relaxed">{step.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ❓ FAQ Section - SEO REACH Magnet */}
        <section id="faq" className="py-40 px-6 max-w-4xl mx-auto">
           <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 text-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <HelpCircle size={14} /> FREQUENTLY ASKED PROTOCOLS
              </div>
              <h2 className="text-5xl md:text-7xl font-black font-display tracking-tighter">Common Inquiries</h2>
           </div>

           <div className="space-y-6">
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className={`group p-8 rounded-[32px] border transition-all duration-500 cursor-pointer ${activeFaq === i ? 'bg-purple/10 border-purple/30' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                  onClick={() => setActiveFaq(i)}
                >
                  <div className="flex items-center justify-between gap-6">
                    <h3 className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${activeFaq === i ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{faq.q}</h3>
                    <div className={`p-2 rounded-xl transition-all ${activeFaq === i ? 'bg-purple text-white rotate-180' : 'bg-white/5 text-white/20'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ${activeFaq === i ? 'max-h-40 mt-6' : 'max-h-0'}`}>
                    <p className="text-white/40 leading-relaxed font-medium text-lg">{faq.a}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* 📊 Global Stats */}
        <section className="py-32 bg-purple/5 border-y border-purple/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
              {[
                { label: 'Protocols Encrypted', val: '12M+' },
                { label: 'Data Points Tracked', val: '450M+' },
                { label: 'Global Entities', val: '2.5k+' },
                { label: 'Uptime Stability', val: '99.9%' },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl md:text-7xl font-black font-display mb-3 gradient-text group-hover:scale-110 transition-transform duration-500 inline-block">{s.val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-60 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/10 blur-[150px] -z-10 rounded-full" />
          <h2 className="text-6xl md:text-9xl font-black font-display tracking-tighter mb-16 leading-[0.85]">
            Give your links<br /><span className="gradient-text">superpowers.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              className="w-full sm:w-auto btn btn-primary !py-6 !px-16 !text-xl shadow-glow active:scale-95 transition-all"
              onClick={() => navigate(user ? '/dashboard' : '/login')}
            >
              {user ? 'Go to Dashboard' : 'Initiate Protocol'} <ArrowRight size={24} />
            </button>
             <button
              className="w-full sm:w-auto px-16 py-6 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-black text-xl uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
          <p className="mt-12 text-white/10 text-sm font-black uppercase tracking-[0.4em]">Zero latency • Unlimited potential • End-to-end security</p>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-[#05050a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-purple rounded-xl flex items-center justify-center"><Zap size={20} fill="white" /></div>
                <span className="font-display text-2xl font-black">kkoneurl</span>
              </div>
              <p className="text-white/20 text-lg max-w-sm leading-relaxed font-medium mb-4">The definitive link management ecosystem for the modern digital era.</p>
              <button onClick={() => window.location.href = 'mailto:kanniyakumarione@gmail.com'} className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-light hover:text-white transition-colors">Contact System Admin</button>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Navigation</h4>
               <ul className="space-y-4 text-sm font-bold text-white/20">
                 <li><a href="#features" className="hover:text-purple-light transition-colors">Features</a></li>
                 <li><a href="#how-it-works" className="hover:text-purple-light transition-colors">How it works</a></li>
                 <li><a href="#faq" className="hover:text-purple-light transition-colors">FAQ</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Legal & Docs</h4>
               <ul className="space-y-4 text-sm font-bold text-white/20">
                 <li><Link to="/privacy" className="hover:text-purple-light transition-colors">Privacy Protocol</Link></li>
                 <li><Link to="/terms" className="hover:text-purple-light transition-colors">Terms of Service</Link></li>
                 <li><Link to="/api-docs" className="hover:text-purple-light transition-colors">Developer API</Link></li>
               </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/10">
               <span className="flex items-center gap-2"><Globe2 size={12} /> GLOBAL SYSTEM</span>
               <span className="flex items-center gap-2"><Shield size={12} /> ENCRYPTED</span>
            </div>
            <span className="font-display font-black text-white/10 text-xs tracking-widest">KKONEURL SYSTEM © {new Date().getFullYear()} • ALL PROTOCOLS RESERVED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
