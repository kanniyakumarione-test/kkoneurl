import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
          <div className="w-12 h-12 bg-purple/20 rounded-2xl flex items-center justify-center text-purple-light">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight">Privacy Policy</h1>
        </div>

        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>We collect only the data needed to shorten links, secure accounts, and provide analytics.</p>
          <p>Usage analytics may include clicks, timestamp, and basic device metadata for performance reporting.</p>
          <p>We do not sell personal data. Data is processed for product operation, security, and support.</p>
          <p>If you need account deletion or data export, contact support from your registered email address.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
