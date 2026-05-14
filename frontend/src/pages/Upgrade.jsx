import { useState } from 'react';
import { Sparkles, Check, CreditCard, ArrowRight, Zap, Shield, BarChart3, Globe, Crown, Globe2, IndianRupee, MousePointer2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PayPalButtons } from '@paypal/react-paypal-js';
import * as api from '../api';

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 text-white/70 group">
    <div className="w-5 h-5 rounded-full bg-purple/20 flex items-center justify-center text-purple-light group-hover:bg-purple group-hover:text-white transition-all duration-300">
      <Check size={12} strokeWidth={3} />
    </div>
    <span className="text-sm font-medium transition-colors group-hover:text-white">{text}</span>
  </div>
);

const Upgrade = () => {
  const { profile, refreshProfile, user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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
          try {
            toast('Payment successful! Verifying...', 'success');
            await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId
            });
            toast('Upgrade successful! Welcome to Pro! 🚀', 'success');
            refreshProfile();
          } catch (err) {
            toast('Payment verification failed', 'error');
          }
        },
        prefill: {
          name: profile?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast('Failed to initialize Razorpay', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.plan === 'pro') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="card text-center space-y-8 p-16 border-purple/30 shadow-2xl shadow-purple/10 relative overflow-hidden bg-bg-secondary/50 backdrop-blur-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan/5 blur-[100px]" />
          
          <div className="w-24 h-24 bg-gradient-to-tr from-purple to-purple-light rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-purple/20 animate-float">
            <Crown size={48} fill="currentColor" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black font-display tracking-tight text-white">Elite Pro Member</h1>
            <p className="text-white/40 max-w-md mx-auto text-lg">Your subscription is active and all premium features are unlocked. You're part of the 1%.</p>
          </div>

          <div className="pt-6">
             <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-[0.2em] text-purple-light">
               <Shield size={16} /> Valid until {new Date(profile.pro_until).toLocaleDateString()}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-16 relative">
        {/* Cinematic Header */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">
            <Sparkles size={14} className="text-purple-light" /> Upgrade your Experience
          </div>
          <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter leading-[0.85] text-white">
            Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light via-purple to-pink">Power</span> of Pro
          </h1>
          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Take total control of your digital presence with unlimited link shortening, advanced analytics, and premium bio page features.
          </p>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Features Column */}
          <div className="lg:col-span-7 space-y-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-purple-light group-hover:rotate-12 transition-transform"><Zap size={24} /></div>
                <h3 className="text-xl font-bold">Infinite Links</h3>
                <p className="text-sm text-white/40 leading-relaxed">Break free from the 100-link cage. Create as many short links as your brand needs.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan group-hover:rotate-12 transition-transform"><BarChart3 size={24} /></div>
                <h3 className="text-xl font-bold">Geo Analytics</h3>
                <p className="text-sm text-white/40 leading-relaxed">Know exactly where your audience is. City, country, device, and browser level insights.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-pink/10 flex items-center justify-center text-pink group-hover:rotate-12 transition-transform"><Globe size={24} /></div>
                <h3 className="text-xl font-bold">Branded Bio</h3>
                <p className="text-sm text-white/40 leading-relaxed">Remove the KKOneURL watermark and unlock high-converting premium bio page themes.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-purple-light group-hover:rotate-12 transition-transform"><Shield size={24} /></div>
                <h3 className="text-xl font-bold">Priority API</h3>
                <p className="text-sm text-white/40 leading-relaxed">Integrate our tech into your workflow. High-rate limits and zero latency for your projects.</p>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-r from-purple/10 to-transparent border-l-4 border-purple rounded-2xl">
               <p className="italic text-white/60 text-lg">"KKOneURL Pro completely transformed how we track our marketing campaigns. The data accuracy is unmatched."</p>
               <p className="mt-4 text-xs font-black uppercase tracking-widest text-white/30">— Digital Agency CEO</p>
            </div>
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-5 relative">
            <div className="card p-10 space-y-10 border-white/10 shadow-2xl shadow-purple/10 bg-bg-secondary/40 backdrop-blur-2xl sticky top-24 rounded-[3rem]">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Monthly Pro</h2>
                  <div className="px-3 py-1 bg-purple/20 text-purple-light text-[9px] font-black rounded-full uppercase tracking-widest border border-purple/20">Most Popular</div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-purple/30 transition-all group cursor-default">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2"><IndianRupee size={10} /> Domestic / India</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white group-hover:text-purple-light transition-colors">₹399</span>
                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">/ Mo</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center text-purple-light group-hover:scale-110 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan/30 transition-all group cursor-default">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2"><Globe2 size={10} /> Global / International</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white group-hover:text-cyan transition-colors">$5.00</span>
                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">/ Mo</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan group-hover:scale-110 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <FeatureItem text="Unlimited Link Shortening" />
                  <FeatureItem text="Advanced Device & Geo Analytics" />
                  <FeatureItem text="Developer API (Pro Level)" />
                  <FeatureItem text="Custom Bio Branding" />
                </div>

                <div className="pt-6 space-y-4">
                  <button 
                    onClick={handleRazorpayPayment}
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-[#3395FF] to-[#2085EE] text-white font-black rounded-2xl shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
                  >
                    <IndianRupee size={16} /> {loading ? 'Initializing...' : 'Checkout via Razorpay'}
                  </button>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative px-3 bg-bg-secondary text-[10px] font-bold text-white/10 uppercase tracking-widest">Secure International Payment</span>
                  </div>

                  <div className="rounded-2xl overflow-hidden bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-colors">
                    <PayPalButtons
                      style={{ 
                        label: 'subscribe',
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        height: 50
                      }}
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id: 'P-6XB22278MB2849041NICLVSA',
                          custom_id: profile?.id || user?.id
                        });
                      }}
                      onApprove={() => {
                        toast('International upgrade successful!', 'success');
                        refreshProfile();
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-white/20">
                <Shield size={14} />
                <p className="text-[9px] font-bold uppercase tracking-widest">SSL Encrypted Secure Transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
