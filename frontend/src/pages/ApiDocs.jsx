import { useEffect } from 'react';
import { Zap, ArrowLeft, Copy, Terminal, Code2, Globe, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ApiDocs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Developer Hub | KKOneURL API Documentation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "Full API documentation for KKOneURL. Integrate professional link shortening and analytics directly into your own applications.");
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied!`, 'success');
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/links/shorten',
      desc: 'Create a new high-performance short link programmatically.',
      body: `{
  "original_url": "https://example.com",
  "short_code": "custom-slug",
  "password": "secret-gate",
  "expiresAt": "2024-12-31"
}`
    },
    {
      method: 'GET',
      path: '/api/links/stats/:code',
      desc: 'Retrieve deep analytics and engagement metrics for a specific link.',
      body: `{
  "clicks": 1250,
  "unique_visitors": 940,
  "top_country": "US",
  "last_click": "2024-05-14T12:00:00Z"
}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#07070f] text-[#f0f0ff] relative overflow-hidden selection:bg-purple/30">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[10%] w-[40%] h-[40%] bg-cyan/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-white/20 hover:text-white mb-16 transition-all uppercase text-[10px] font-black tracking-[0.3em]"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple/20 group-hover:text-purple transition-all">
            <ArrowLeft size={14} />
          </div>
          Return to Hub
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan-light text-[10px] font-black uppercase tracking-widest mb-6">
              <Code2 size={12} /> DEVELOPER PROTOCOL
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter">API Documentation</h1>
          </div>
          <p className="text-white/20 text-xs font-black uppercase tracking-widest pb-2">API Version: v2.4.0-Stable</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
           <div className="card group">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-purple group-hover:scale-110 transition-transform"><Globe size={20} /></div>
                 <h4 className="text-xl font-black tracking-tight">Base URL</h4>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between group-hover:border-purple/30 transition-all">
                 <code className="text-purple-light text-sm font-bold truncate">https://kkoneurl.kanniyakumarione.com</code>
                 <button onClick={() => handleCopy('https://kkoneurl.kanniyakumarione.com', 'Base URL')} className="p-2 text-white/10 hover:text-white transition-colors"><Copy size={16} /></button>
              </div>
           </div>
           <div className="card group">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-cyan group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                 <h4 className="text-xl font-black tracking-tight">Authentication</h4>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                 Include your Bearer Token in the authorization header for all protected endpoints.
              </p>
           </div>
        </div>

        <div className="space-y-16">
          {endpoints.map((ep, i) => (
            <div key={i} className="group relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.2em] shadow-lg ${ep.method === 'POST' ? 'bg-purple/20 text-purple-light border border-purple/30' : 'bg-green/20 text-green border border-green/30'}`}>{ep.method}</span>
                  <code className="text-lg font-bold text-white/60 tracking-tight group-hover:text-white transition-colors">{ep.path}</code>
                </div>
                <button onClick={() => handleCopy(`https://kkoneurl.kanniyakumarione.com${ep.path}`, 'Endpoint')} className="p-3 bg-white/5 rounded-xl text-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-90"><Copy size={18} /></button>
              </div>
              
              <div className="card !p-10 bg-white/[0.01] border-white/5 group-hover:border-white/10 transition-all duration-500 shadow-2xl">
                <p className="text-white/40 text-lg mb-8 font-medium leading-relaxed">{ep.desc}</p>
                {ep.body && (
                  <div className="relative group/code">
                    <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-white/10">JSON Body</div>
                    <pre className="bg-black/60 p-8 rounded-[32px] border border-white/5 overflow-x-auto shadow-inner group-hover/code:border-purple/20 transition-all duration-500">
                      <code className="text-purple-light text-sm leading-relaxed font-mono">{ep.body}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 p-12 rounded-[40px] bg-gradient-to-br from-purple/10 to-transparent border border-white/5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10">
            <h4 className="text-3xl font-black mb-6 tracking-tighter">Ready to scale?</h4>
            <p className="text-white/30 text-lg mb-10 max-w-xl mx-auto font-medium">Join our developer ecosystem and build the future of link management.</p>
            <button 
              onClick={() => navigate(user ? '/settings' : '/login')}
              className="btn btn-primary !px-16 !py-5 !text-lg shadow-glow active:scale-95 transition-all"
            >
              {user ? 'Go to Settings' : 'Get API Key'}
            </button>
          </div>
        </div>

        <footer className="mt-40 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
          <div className="flex items-center gap-2">
            <Terminal size={14} /> KKONEURL DEVELOPER RELATIONS
          </div>
          <span>v2.4.0-PRO</span>
        </footer>
      </div>
    </div>
  );
};

export default ApiDocs;
