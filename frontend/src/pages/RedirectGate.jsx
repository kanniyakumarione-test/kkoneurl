import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Rocket, Sparkles } from 'lucide-react';
import axios from 'axios';

const RedirectGate = () => {
  const { code } = useParams();
  const [countdown, setCountdown] = useState(5);
  const [linkData, setLinkData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://kkoneurl.kanniyakumarione.com/api';
        const { data } = await axios.get(`${apiUrl}/links/public/${code}`);
        setLinkData(data);
      } catch (err) {
        console.error('Failed to fetch link data', err);
        setError(true);
      }
    };
    fetchLinkData();
  }, [code]);

  useEffect(() => {
    if (countdown > 0 && linkData) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && linkData) {
      window.location.replace(linkData.original_url);
    }
  }, [countdown, linkData]);

  useEffect(() => {
    // 💰 Inject Monetag Multitag specifically for the gate page
    const script = document.createElement('script');
    script.src = "https://quge5.com/88/tag.min.js";
    script.setAttribute('data-zone', '239335');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.head.appendChild(script);

    return () => {
      // Clean up if necessary, though global scripts usually stay
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center text-white p-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-pink/10 rounded-3xl flex items-center justify-center text-pink mx-auto">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight">Link Expired or Invalid</h1>
          <p className="text-white/40 max-w-sm mx-auto">This link protocol could not be established. It may have been removed or the security certificate expired.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-primary !py-3 !px-8"
          >
            Back to Base
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white relative overflow-hidden flex flex-col items-center p-6 lg:p-20">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-cyan/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
      </div>

      {/* 💰 Monetag Ad Scripts can be placed here */}
      {/* <script src="//monetag.com/tag.js"></script> */}

      <div className="relative z-10 w-full max-w-6xl flex flex-col gap-12">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-purple rounded-lg flex items-center justify-center"><Zap size={16} fill="white" /></div>
             <span className="font-display text-xl font-black">kkoneurl<span className="text-purple-light"> gateway</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Protocol Secured by SSL</span>
             <Shield size={14} className="text-green" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Redirect Info & Monetag Main Ad */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter leading-none">
                Redirecting in <span className="gradient-text font-mono">{countdown}s</span>
              </h1>
              <p className="text-white/30 text-lg font-medium max-w-md">
                Verifying destination: <span className="text-purple-light underline decoration-purple/30 truncate block mt-1">{linkData?.original_url || '...'}</span>
              </p>
            </div>

            {/* 🚀 Monetag AD ZONE (Main Banner) */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple/20 to-cyan/20 rounded-3xl blur opacity-75" />
              <div className="relative w-full aspect-[16/5] bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 overflow-hidden">
                {/* 
                   PASTE YOUR MONETAG AD TAG HERE 
                   Example: <div id="monetag-ad-12345"></div> 
                */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mb-2">Sponsored Content</div>
                  <p className="text-white/40 text-xs italic">Advertisement from our partners will appear here</p>
                  <div className="w-12 h-1 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>

            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-[2px] border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-purple to-cyan rounded-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(108,99,255,0.5)]" 
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Right Column: Pro Upsell & Monetag Native Ad */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card !p-8 border-purple/30 bg-purple/10 backdrop-blur-3xl relative group overflow-hidden shadow-glow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/20 blur-[60px] rounded-full -z-10 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-purple rounded-xl flex items-center justify-center">
                  <Zap size={20} fill="white" />
                </div>
                <h4 className="text-lg font-black tracking-tight">Upgrade to Pro</h4>
              </div>

              <ul className="space-y-3 mb-8">
                {["Zero Delay", "Logo in QR", "Advanced Analytics"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-white/50">
                    <Sparkles size={12} className="text-purple-light" /> {t}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full btn btn-primary !py-4 !text-xs"
              >
                Skip Gates Forever <ArrowRight size={14} />
              </button>
            </div>

            {/* 🚀 Monetag NATIVE / SQUARE AD ZONE */}
            <div className="w-full aspect-square bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-6">
               <div className="text-[9px] font-black uppercase tracking-widest text-white/5 mb-4">Partner Highlight</div>
               <div className="w-full h-full border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  Square Ad Zone
               </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-center">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/5">KKONEURL SECURE GATEWAY • ENCRYPTED SESSION</p>
      </footer>
    </div>
  );
};

export default RedirectGate;
