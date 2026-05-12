import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Zap } from 'lucide-react';
import * as api from '../api';

const THEMES = {
  'dark-purple': { bg: 'bg-[#0e0a1f]', grad: 'from-[#0e0a1f] to-[#1a1040]', accent: 'text-purple', border: 'border-purple' },
  'dark-cyan': { bg: 'bg-[#071828]', grad: 'from-[#071828] to-[#0a1f2e]', accent: 'text-cyan', border: 'border-cyan' },
  'midnight': { bg: 'bg-[#07070f]', grad: 'from-[#07070f] to-[#12121a]', accent: 'text-purple-light', border: 'border-purple-light' },
};

const PublicBio = () => {
  const { username } = useParams();
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
        const { data } = await api.fetchPublicProfile(cleanUsername);
        setBio({
          displayName: data.display_name,
          bio: data.bio,
          avatar: data.avatar,
          theme: data.theme,
          links: data.bio_links || []
        });
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#07070f] text-white/20 uppercase tracking-[0.4em] font-black">Loading Profile...</div>;
  if (!bio) return <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07070f] text-white">
    <h1 className="text-4xl font-black mb-4 tracking-tighter">Profile Not Found</h1>
    <p className="text-white/40">This link-in-bio page doesn't exist or has been removed.</p>
  </div>;

  const t = THEMES[bio.theme] || THEMES['dark-purple'];

  return (
    <div className={`min-h-screen w-full flex justify-center py-20 px-6 ${t.bg} bg-gradient-to-br ${t.grad} text-white`}>
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className={`w-28 h-28 rounded-full border-4 ${t.border} p-1 mb-6 shadow-2xl shadow-black/50`}>
          <div className="w-full h-full rounded-full bg-white/5 overflow-hidden flex items-center justify-center">
            {bio.avatar ? <img src={bio.avatar} className="w-full h-full object-cover" /> : <span className="text-4xl">👤</span>}
          </div>
        </div>

        <h1 className="text-3xl font-black font-display tracking-tight mb-2 uppercase">{bio.displayName}</h1>
        <p className="text-white/60 text-center mb-10 max-w-md leading-relaxed">{bio.bio}</p>

        <div className="w-full space-y-4 mb-20">
          {bio.links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
              style={{ borderColor: `${link.color}40` }}
            >
              <div className="flex items-center gap-5">
                <span className="text-2xl">{link.icon}</span>
                <span className="flex-1 font-bold text-lg">{link.label}</span>
                <ExternalLink size={18} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 opacity-30 font-black text-[10px] uppercase tracking-[0.3em]">
          <Zap size={14} fill="currentColor" />
          Powered by kkoneurl
        </div>
      </div>
    </div>
  );
};

export default PublicBio;
