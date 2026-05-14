import { useEffect } from 'react';
import { ArrowLeft, FileText, Scale, Zap, AlertCircle, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terms of Service | KKOneURL Usage Guidelines";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "Guidelines and terms for using the KKOneURL link management ecosystem. Professional protocols for secure link shortening.");
  }, []);

  const sections = [
    {
      icon: <Scale className="text-cyan" />,
      title: "Usage Protocol",
      content: "By initiating a session with KKOneURL, you agree to utilize our link management systems for lawful purposes only. Any attempt to disrupt system integrity or bypass security measures is strictly prohibited."
    },
    {
      icon: <Zap className="text-purple" />,
      title: "Link Responsibility",
      content: "You maintain 100% ownership and responsibility for the content behind your shortened URLs. KKOneURL acts as a technical intermediary and does not endorse or assume liability for destination content."
    },
    {
      icon: <Ban className="text-pink" />,
      title: "Prohibited Content",
      content: "Our system automatically terminates links associated with malware, phishing, hate speech, or illegal material. We maintain a zero-tolerance policy for platform abuse to protect our global reputation."
    },
    {
      icon: <AlertCircle className="text-orange" />,
      title: "Service Availability",
      content: "While we maintain 99.9% uptime, we reserve the right to perform critical system maintenance or upgrades. We are not liable for temporary data access latencies during high-priority security patches."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07070f] text-[#f0f0ff] relative overflow-hidden selection:bg-cyan/30">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-purple/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-white/20 hover:text-white mb-16 transition-all uppercase text-[10px] font-black tracking-[0.3em]"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan/20 group-hover:text-cyan transition-all">
            <ArrowLeft size={14} />
          </div>
          Return to Core
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan-light text-[10px] font-black uppercase tracking-widest mb-6">
              <FileText size={12} /> SERVICE GUIDELINES
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter">Terms of Service</h1>
          </div>
          <p className="text-white/20 text-xs font-black uppercase tracking-widest pb-2">Effective: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <div key={i} className="card group hover:border-cyan/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-2xl">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-white transition-colors">{section.title}</h3>
                  <p className="text-white/40 leading-relaxed text-lg font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 text-center">
            <h4 className="text-2xl font-black mb-4">Acceptance of Protocols</h4>
            <p className="text-white/30 text-lg leading-relaxed font-medium mb-8">
              By accessing the KKONEURL ecosystem, you signify your full acceptance of these terms. These protocols are designed to maintain platform integrity for our thousands of global users.
            </p>
            <button 
              onClick={() => window.location.href = 'mailto:kanniyakumarione@gmail.com'}
              className="btn btn-primary !px-10 shadow-glow"
            >
              Contact Support
            </button>
          </div>
        </div>

        <footer className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
          <span>KKONEURL PROTOCOLS</span>
          <span>SYSTEM VER: 2.4.0</span>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
