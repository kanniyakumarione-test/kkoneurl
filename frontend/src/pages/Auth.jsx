import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Auth = () => {
  const location = useLocation();
  const pendingUrl = location.state?.pendingUrl;
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast('Welcome back!', 'success');
      } else {
        await register(form.email, form.password, form.name);
        toast('Account created!', 'success');
      }
      navigate(pendingUrl ? '/links' : '/dashboard', { state: { pendingUrl } });
    } catch (err) {
      toast(err.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
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

        <div className="card !p-8 shadow-2xl border-white/5">
          <h2 className="text-2xl font-black font-display mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-white/40 text-sm mb-8">{isLogin ? 'Log in to manage your premium links' : 'Join thousands of creators using kkoneurl'}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input className="input !pl-12" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input className="input !pl-12" type="email" placeholder="name@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  className="input !pl-12 !pr-12" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
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
            </div>

            <button className={`btn btn-primary w-full !py-4 !rounded-2xl shadow-glow !mt-8 ${loading ? 'opacity-50' : ''}`} disabled={loading}>
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-bg-card px-4 text-white/20">kkoneurl secure access</span></div>
          </div>

          <p className="text-center text-sm text-white/30">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button className="text-purple-light font-bold hover:underline" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
