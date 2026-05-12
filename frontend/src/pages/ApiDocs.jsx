import { Zap, ArrowLeft, Copy, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ApiDocs = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast('Endpoint copied!', 'success');
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/links/shorten',
      desc: 'Create a new short link programmatically.',
      body: `{
  "original_url": "https://example.com",
  "short_code": "custom-slug",
  "password": "secret-gate"
}`
    },
    {
      method: 'GET',
      path: '/api/links/stats/:code',
      desc: 'Fetch real-time analytics for a specific link.',
      body: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a10] text-[#f0f0ff] p-6 md:p-20 selection:bg-purple/30">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-cyan/20 rounded-2xl flex items-center justify-center text-cyan shadow-lg shadow-cyan/10">
            <Terminal size={24} />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight">API Documentation</h1>
        </div>
        <p className="text-white/40 mb-16 max-w-xl">Integrate KKOneURL directly into your apps and workflows with our developer-first API.</p>

        <div className="space-y-12">
          {endpoints.map((ep, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${ep.method === 'POST' ? 'bg-purple/20 text-purple-light' : 'bg-green/20 text-green'}`}>{ep.method}</span>
                  <code className="text-sm font-bold text-white/60">{ep.path}</code>
                </div>
                <button onClick={() => handleCopy(`https://kkoneurl.vercel.app${ep.path}`)} className="p-2 text-white/10 hover:text-white transition-colors"><Copy size={16} /></button>
              </div>
              <div className="card !p-8 bg-white/[0.02] border-white/5 group-hover:border-white/10 transition-all">
                <p className="text-white/40 text-sm mb-6">{ep.desc}</p>
                {ep.body && (
                  <pre className="bg-black/40 p-6 rounded-2xl border border-white/5 overflow-x-auto">
                    <code className="text-purple-light text-xs leading-relaxed">{ep.body}</code>
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ApiDocs;
