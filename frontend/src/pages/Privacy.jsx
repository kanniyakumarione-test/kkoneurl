import { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Privacy Protocol | KKOneURL Security Center";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', "KKOneURL's commitment to data security and user privacy. Learn how we protect your link data and analytics.");
  }, []);

  const sections = [
    {
      icon: <Eye className="text-purple" />,
      title: "Data Collection",
      content: "We collect only the essential data needed to shorten your links, secure your account, and provide accurate performance analytics. This includes email addresses for authentication and basic usage metadata."
    },
    {
      icon: <Server className="text-cyan" />,
      title: "Analytics Usage",
      content: "When users click your links, we process real-time engagement data: timestamps, geographic regions (country-level), and browser/device types. This data is used solely to generate your dashboard reports."
    },
    {
      icon: <Lock className="text-pink" />,
      title: "Security Protocols",
      content: "Your data is encrypted both in transit and at rest. We utilize industry-standard security protocols to ensure that your link destination rules and account information remain private."
    },
    {
      icon: <UserCheck className="text-green" />,
      title: "Your Rights",
      content: "You maintain full control over your data. You can export your link history or request permanent account deletion at any time through your account settings or support channel."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07070f] text-[#f0f0ff] relative overflow-hidden selection:bg-purple/30">
      {/* 🔮 Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-cyan/5 rounded-full blur-[150px]" />
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
          Back to Protocol
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple-light text-[10px] font-black uppercase tracking-widest mb-6">
              <Shield size={12} /> SECURE DATA PROTOCOL
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter">Privacy Policy</h1>
          </div>
          <p className="text-white/20 text-xs font-black uppercase tracking-widest pb-2">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <div key={i} className="card group hover:border-purple/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
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

        <div className="mt-20 p-10 rounded-[40px] bg-white/[0.02] border border-white/5 text-center">
          <h4 className="text-2xl font-black mb-4">Have questions about your data?</h4>
          <p className="text-white/30 mb-8 max-w-xl mx-auto">Our security team is ready to assist you with any inquiries regarding our privacy protocols or data handling.</p>
          <button className="btn btn-primary !px-10 shadow-glow" onClick={() => window.location.href = 'mailto:kanniyakumarione@gmail.com'}>Contact Security Team</button>
        </div>

        <footer className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
          <span>KKONEURL SYSTEM</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
