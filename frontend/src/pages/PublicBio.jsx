import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Zap, Camera, Code, Share2, Play, Briefcase } from 'lucide-react';
import * as api from '../api';

const THEMES = {
  'dark-purple': { bg: 'bg-[#0e0a1f]', grad: 'from-[#0e0a1f] to-[#1a1040]', accent: 'text-purple', border: 'border-purple', btn: 'bg-white/5 border-white/10 hover:bg-white/10' },
  'dark-cyan': { bg: 'bg-[#071828]', grad: 'from-[#071828] to-[#0a1f2e]', accent: 'text-cyan', border: 'border-cyan', btn: 'bg-white/5 border-white/10 hover:bg-white/10' },
  'midnight': { bg: 'bg-[#07070f]', grad: 'from-[#07070f] to-[#12121a]', accent: 'text-purple-light', border: 'border-purple-light', btn: 'bg-white/5 border-white/10 hover:bg-white/10' },
  'glass-purple': { bg: 'bg-[#6c63ff]', grad: 'from-[#6c63ff] to-[#9b94ff]', accent: 'text-white', border: 'border-white', glass: true, btn: 'bg-white/20 border-white/30 backdrop-blur-xl hover:bg-white/30' },
  'glass-cyan': { bg: 'bg-[#00d4ff]', grad: 'from-[#00d4ff] to-[#00e5ff]', accent: 'text-white', border: 'border-white', glass: true, btn: 'bg-white/20 border-white/30 backdrop-blur-xl hover:bg-white/30' },
  'neo-dark': { bg: 'bg-[#121212]', grad: 'from-[#121212] to-[#1a1a1a]', accent: 'text-[#43e97b]', border: 'border-[#43e97b]', neo: true, btn: 'bg-[#121212] border-[#222] shadow-[6px_6px_12px_#080808,-6px_-6px_12px_#1c1c1c] hover:shadow-inner' },
};

const SOCIAL_ICONS = {
  instagram: <Camera size={20} />,
  github: <Code size={20} />,
  twitter: <Share2 size={20} />,
  x: <Share2 size={20} />,
  youtube: <Play size={20} />,
  linkedin: <Briefcase size={20} />,
};

const PublicBio = () => {
  const { username } = useParams();
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return setLoading(false);

      try {
        const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
        const { data } = await api.fetchPublicProfile(cleanUsername);
        setBio({
          displayName: data.display_name,
          bio: data.bio,
          avatar: data.avatar,
          theme: data.theme,
          customBg: data.custom_bg,
          customAccent: data.custom_accent,
          links: data.bio_links || [],
          socialLinks: data.social_links || {},
          embeds: data.embeds || [],
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
  if (!bio) return <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#07070f] text-white p-6 text-center">
    <h1 className="text-4xl font-black mb-4 tracking-tighter">Profile Not Found</h1>
    <p className="text-white/40">This link-in-bio page doesn't exist or has been removed.</p>
  </div>;

  const isCustom = bio.theme === 'custom';
  const t = THEMES[bio.theme] || THEMES['dark-purple'];
  const bgStyle = isCustom ? { background: bio.customBg } : {};
  const accentColor = isCustom ? bio.customAccent : undefined;

  return (
    <div 
      className={`min-h-screen w-full flex justify-center py-20 px-6 ${!isCustom ? `${t.bg} bg-gradient-to-br ${t.grad}` : ''} text-white transition-colors duration-500`}
      style={bgStyle}
    >
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Avatar */}
        <div 
          className={`w-28 h-28 rounded-full border-4 p-1 mb-6 shadow-2xl shadow-black/50 overflow-hidden ${!isCustom ? t.border : ''}`}
          style={isCustom ? { borderColor: accentColor } : {}}
        >
          <div className="w-full h-full rounded-full bg-white/5 overflow-hidden flex items-center justify-center">
            {bio.avatar ? <img src={bio.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <span className="text-4xl">👤</span>}
          </div>
        </div>

        <h1 className="text-3xl font-black font-display tracking-tight mb-2 uppercase text-center">{bio.displayName}</h1>
        <p className="text-white/60 text-center mb-6 max-w-md leading-relaxed">{bio.bio}</p>

        {/* Social Icons Bar */}
        <div className="flex gap-4 mb-10">
          {Object.entries(bio.socialLinks).map(([platform, url]) => url && (
            <a key={platform} href={url} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full flex items-center justify-center ${t.btn} transition-all hover:scale-110`} style={isCustom ? { color: accentColor } : {}}>
              {SOCIAL_ICONS[platform] || platform[0].toUpperCase()}
            </a>
          ))}
        </div>

        {/* Links */}
        <div className="w-full space-y-4 mb-10">
          {bio.links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block p-5 rounded-[2rem] border transition-all hover:scale-[1.02] active:scale-[0.98] ${t.btn}`}
              style={{ borderColor: isCustom ? `${accentColor}40` : (!t.glass && !t.neo ? `${link.color}40` : undefined) }}
            >
              <div className="flex items-center gap-5">
                <span className="text-2xl">{link.icon}</span>
                <span className="flex-1 font-bold text-lg">{link.label}</span>
                <ExternalLink size={18} className="opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
            </a>
          ))}
        </div>

        {/* Embeds (YouTube / Spotify) */}
        {bio.embeds.map((embed, i) => (
          <div key={i} className="w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-2xl border border-white/10">
            {embed.type === 'youtube' ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${embed.id}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            ) : embed.type === 'spotify' ? (
              <iframe className="w-full h-full" src={`https://open.spotify.com/embed/track/${embed.id}`} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            ) : null}
          </div>
        ))}


        <div className="flex items-center gap-3 opacity-30 font-black text-[10px] uppercase tracking-[0.3em] pb-10" style={isCustom ? { color: accentColor } : {}}>
          <Zap size={14} fill="currentColor" />
          Powered by kkoneurl
        </div>
      </div>
    </div>
  );
};

export default PublicBio;
