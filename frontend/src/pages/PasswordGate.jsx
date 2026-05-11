import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Zap, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const PasswordGate = () => {
  const { code } = useParams();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) return;
    
    // Redirect to the same short link but with the password in query
    // The backend will now verify it and allow redirection
    window.location.href = `/${code}?password=${encodeURIComponent(password)}`;
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden text-[#f0f0ff]">
      {/* Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-purple/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-cyan/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple to-purple-dark rounded-2xl flex items-center justify-center shadow-lg shadow-purple/30">
              <Zap size={24} fill="white" className="text-white" />
            </div>
            <span className="font-display text-3xl font-black tracking-tight text-white">kkone<span className="text-purple-light">url</span></span>
          </div>
        </div>

        <div className="card !p-8 shadow-2xl border-white/5 text-center">
          <div className="w-16 h-16 bg-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-light border border-purple/20">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-black font-display mb-2">Protected Link</h2>
          <p className="text-white/40 text-sm mb-8">This link is protected by a password gate. Please enter the password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Enter Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  className={`input !pl-12 !pr-12 ${error ? 'border-pink/50' : ''}`} 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => {setPassword(e.target.value); setError(false);}} 
                  autoFocus
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-pink text-[10px] font-bold uppercase mt-2 flex items-center gap-1">
                  <ShieldAlert size={12} /> Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button className="btn btn-primary w-full !py-4 !rounded-2xl shadow-glow !mt-8">
              Unlock Link <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/10">kkoneurl secure protection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
