import { Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LegalPage = ({ title, content }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a10] text-[#f0f0ff] p-6 md:p-20 selection:bg-purple/30">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-purple/20 rounded-xl flex items-center justify-center text-purple">
            <Zap size={20} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight">{title}</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/60 leading-relaxed">
          {content}
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/10 text-center">
          KKONEURL Professional Link Management Platform
        </footer>
      </div>
    </div>
  );
};

export default LegalPage;
