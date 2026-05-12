import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a10] text-[#f0f0ff] p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-cyan/20 rounded-2xl flex items-center justify-center text-cyan">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight">Terms of Service</h1>
        </div>

        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>By using KKOneURL, you agree to use the service lawfully and avoid malicious or prohibited content.</p>
          <p>You are responsible for the links you create, including destination content and compliance requirements.</p>
          <p>Service availability may change without notice for maintenance, upgrades, or security reasons.</p>
          <p>Accounts violating abuse policies may be suspended to protect platform integrity.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
