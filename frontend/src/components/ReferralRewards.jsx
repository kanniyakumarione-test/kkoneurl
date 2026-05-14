import { useState, useEffect, useRef } from 'react';
import { Gift, Users, Copy, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import * as api from '../api';
import { useToast } from '../context/ToastContext';

const ScratchCard = ({ onScratchComplete }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fill with a nice gradient + pattern
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#6c63ff');
    gradient.addColorStop(1, '#9b94ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add some "scratch" texture/noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2);

    let isDrawing = false;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Check if enough is scratched
      const imageData = ctx.getImageData(0, 0, width, height);
      let transparentPixels = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparentPixels++;
      }
      
      const percentage = (transparentPixels / (width * height)) * 100;
      if (percentage > 50 && !isScratched) {
        setIsScratched(true);
        onScratchComplete();
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchMove = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousedown', () => isDrawing = true);
      canvas.removeEventListener('mouseup', () => isDrawing = false);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-crosshair shadow-2xl border-4 border-purple/20">
      <div className="absolute inset-0 bg-bg-card flex flex-col items-center justify-center text-center p-6 space-y-2">
        <Sparkles className="text-purple animate-pulse" size={32} />
        <h4 className="text-xl font-black text-white">REWARD UNLOCKED!</h4>
        <p className="text-xs text-white/40">Scratch the card to see your code</p>
      </div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={225} 
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
    </div>
  );
};

const ReferralRewards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);
  const toast = useToast();

  const fetchStats = async () => {
    try {
      const { data } = await api.getReferralStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const { data } = await api.claimScratchCard();
      setClaimedReward(data);
      toast('Scratch card ready! ✨', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to claim reward', 'error');
    } finally {
      setClaiming(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://kkoneurl.kanniyakumarione.com/register?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    toast('Referral link copied! 🚀', 'success');
  };

  if (loading || !stats) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      {/* Referral Info */}
      <div className="card relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple/10 rounded-full blur-3xl group-hover:bg-purple/20 transition-all duration-700" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-purple">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Refer & Earn</h3>
              <p className="text-xs text-white/40">Get extra links for every 20 friends you invite!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Total Referrals</p>
              <p className="text-2xl font-black">{stats.referralCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Bonus Links</p>
              <p className="text-2xl font-black">+{stats.linkLimit - 100}</p>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Your Referral Link</label>
             <div className="flex gap-2">
                <input 
                  readOnly 
                  value={`https://kkoneurl.kanniyakumarione.com/register?ref=${stats.referralCode}`}
                  className="input flex-1 font-mono text-[10px] opacity-70"
                />
                <button 
                  onClick={copyReferralLink}
                  className="p-3 rounded-xl bg-purple text-white hover:bg-purple-light transition-all shadow-lg shadow-purple/20"
                >
                  <Copy size={16} />
                </button>
             </div>
          </div>

          {/* Progress to next milestone */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Next Reward Progress</span>
              <span className="text-purple">{stats.referralCount % 20}/20</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple to-purple-light transition-all duration-1000" 
                style={{ width: `${(stats.referralCount % 20) / 20 * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rewards / Scratch Card Area */}
      <div className="card border-purple/20 bg-purple/5 flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
        {claimedReward ? (
          <div className="w-full space-y-6 animate-scale-in">
             <ScratchCard onScratchComplete={() => {}} />
             <div className="space-y-3 pt-4">
                <div className="p-4 rounded-2xl bg-bg-primary border-2 border-dashed border-purple/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Copy this code to Promo Section</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl font-mono font-black text-purple-light tracking-wider">{claimedReward.code}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(claimedReward.code);
                        toast('Code copied! Go to Settings to redeem.', 'success');
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                  Worth approximately {claimedReward.value} extra links
                </p>
             </div>
          </div>
        ) : stats.availableScratchCards > 0 ? (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-purple/20 flex items-center justify-center text-purple mx-auto animate-bounce">
              <Gift size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-2">You have {stats.availableScratchCards} Scratch Card{stats.availableScratchCards > 1 ? 's' : ''}!</h3>
              <p className="text-sm text-white/40 max-w-xs mx-auto">Claim your reward now and unlock extra link limits for life.</p>
            </div>
            <button 
              onClick={handleClaim}
              disabled={claiming}
              className="btn btn-primary !py-4 !px-12 text-sm uppercase font-black tracking-[0.2em] shadow-xl shadow-purple/20"
            >
              {claiming ? 'Processing...' : 'Claim Scratch Card'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 opacity-40">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mx-auto">
              <Ticket size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight mb-2">No rewards yet</h3>
              <p className="text-xs text-white/40 max-w-xs mx-auto">Refer 20 friends to unlock your first scratch card and earn up to 100 bonus links!</p>
            </div>
            <div className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/20">
              Locked Milestone
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralRewards;
