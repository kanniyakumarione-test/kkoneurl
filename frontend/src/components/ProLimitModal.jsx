import React from 'react';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProLimitModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="card max-w-md w-full border-purple/30 shadow-2xl shadow-purple/10 animate-scale-in relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple/20 blur-[100px]" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="w-16 h-16 rounded-2xl bg-purple/10 flex items-center justify-center text-purple-light shadow-inner">
            <Sparkles size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-black font-display tracking-tight mb-2">You've reached the limit!</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Free accounts are limited to 100 links. Upgrade to Pro to unlock unlimited links and grow your brand.
            </p>
          </div>

          <div className="w-full space-y-3 py-4">
            {[
              "Unlimited Short Links",
              "Custom Bio Pages",
              "Advanced Analytics & Geo-Stats",
              "Priority API Access"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                <div className="w-5 h-5 rounded-full bg-purple/20 flex items-center justify-center text-purple-light">
                  <Check size={12} strokeWidth={3} />
                </div>
                {feature}
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              onClose();
              navigate('/upgrade');
            }}
            className="btn btn-primary w-full !py-4 flex items-center justify-center gap-2 group text-sm font-black uppercase tracking-widest"
          >
            Upgrade to Pro <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProLimitModal;
