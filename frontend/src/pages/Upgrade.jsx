import { useState } from 'react';
import { Sparkles, Check, CreditCard, ArrowRight, Zap, Shield, BarChart3, Globe, Crown, Globe2, IndianRupee, MousePointer2, Rocket, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PayPalButtons } from '@paypal/react-paypal-js';
import * as api from '../api';

const Upgrade = () => {
  const { profile, refreshProfile, user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('domestic'); // 'domestic' or 'global'

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      const amount = 399;
      const userId = profile?.id || user?.id;
      const { data: order } = await api.createRazorpayOrder(amount, userId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'KKOneURL Pro',
        description: '1 Month Pro Subscription',
        image: '/favicon.svg',
        order_id: order.id,
        handler: async function (response) {
          toast('Payment successful! 🚀', 'success');
          await api.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: userId
          });
          refreshProfile();
        },
        prefill: { name: profile?.displayName || '', email: user?.email || '' },
        theme: { color: '#8B5CF6' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast('Payment Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (profile?.plan === 'pro') {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple to-pink rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-purple/30">
          <Crown size={48} fill="white" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4 text-white">Elite Pro Active</h1>
        <p className="text-white/40 text-xl font-medium mb-12">Your account is fully upgraded. Enjoy the freedom.</p>
        <div className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 rounded-full border border-white/10 text-purple-light font-black text-xs uppercase tracking-[0.3em]">
           Valid until {new Date(profile.pro_until).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 relative animate-fade-in">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/[0.03] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
        
        {/* Left Side: Branding & Features */}
        <div className="p-12 lg:p-20 space-y-12 bg-gradient-to-br from-purple/10 via-transparent to-cyan/5">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-purple rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple/20">
              <Sparkles size={32} fill="white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[0.9]">
              Upgrade to <br />
              <span className="text-purple-light">Pro Access</span>
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Remove all limitations and unlock the full potential of your link ecosystem.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Zap size={18} />, text: "Unlimited Short Links" },
              { icon: <BarChart3 size={18} />, text: "Deep Geo & Device Analytics" },
              { icon: <Globe size={18} />, text: "Premium Bio Page Themes" },
              { icon: <Shield size={18} />, text: "Priority Developer API" }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 text-white/60 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-purple-light transition-colors">{f.icon}</div>
                <span className="font-bold text-sm tracking-tight">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-white/20">
             <Lock size={16} />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Bank-grade 256-bit encryption</p>
          </div>
        </div>

        {/* Right Side: Pricing & Checkout */}
        <div className="p-12 lg:p-20 bg-black/40 flex flex-col justify-center space-y-12 border-l border-white/5">
          
          <div className="space-y-8">
            <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setMethod('domestic')}
                className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${method === 'domestic' ? 'bg-purple text-white shadow-lg shadow-purple/20' : 'text-white/30 hover:text-white'}`}
              >
                Domestic (India)
              </button>
              <button 
                onClick={() => setMethod('global')}
                className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${method === 'global' ? 'bg-cyan text-black shadow-lg shadow-cyan/20' : 'text-white/30 hover:text-white'}`}
              >
                Global (Intl)
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">
                  {method === 'domestic' ? '₹399' : '$5.00'}
                </span>
                <span className="text-white/20 font-bold uppercase tracking-widest text-sm">/ Month</span>
              </div>
              <p className="text-white/40 text-xs font-medium">Billed monthly. Cancel anytime.</p>
            </div>
          </div>

          <div className="space-y-6">
            {method === 'domestic' ? (
              <button 
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-purple-light hover:text-white transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
              >
                <CreditCard size={18} /> {loading ? 'Initializing...' : 'Checkout via Razorpay'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] p-6 text-center space-y-4">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">International Checkout</p>
                   <PayPalButtons
                    style={{ label: 'subscribe', layout: 'vertical', color: 'blue', shape: 'rect', height: 50 }}
                    createSubscription={(data, actions) => {
                      return actions.subscription.create({
                        plan_id: 'P-6XB22278MB2849041NICLVSA',
                        custom_id: profile?.id || user?.id
                      });
                    }}
                    onApprove={() => {
                      toast('Global Pro Activated!', 'success');
                      refreshProfile();
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-purple/10 rounded-full border border-purple/20 text-purple-light text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} fill="currentColor" className="opacity-50" /> 1,248 Active Pro Members
             </div>
             <p className="text-[11px] text-white/30 font-medium">Join the fastest growing community of link experts.</p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Upgrade;
