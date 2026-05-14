import { useState } from 'react';
import { QrCode, Download, Palette, Link2, Check, ChevronDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const QR_SIZES = [128, 256, 512];
const QR_STYLES = [
  { id: 'default', label: 'Classic', fg: '#ffffff', bg: '#07070f' },
  { id: 'purple', label: 'Purple', fg: '#9b94ff', bg: '#0e0e1a' },
  { id: 'cyan', label: 'Cyan', fg: '#00d4ff', bg: '#07070f' },
  { id: 'green', label: 'Green', fg: '#43e97b', bg: '#071408' },
];

const getQRUrl = (text, size, fg, bg) => {
  const fgHex = fg.replace('#', '');
  const bgHex = bg.replace('#', '');
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fgHex}&bgcolor=${bgHex}&qzone=2&format=png`;
};

const QRCode = ({ links }) => {
  const safeLinks = Array.isArray(links) ? links : [];
  const toast = useToast();
  const [selected, setSelected] = useState(safeLinks[0]?._id || '');
  const [size, setSize] = useState(256);
  const [style, setStyle] = useState(QR_STYLES[0]);
  const [useCustom, setUseCustom] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const link = safeLinks.find(l => (l._id || l.id) === selected) || safeLinks[0];
  const domain = 'kkoneurl.kanniyakumarione.com';
  const qrText = useCustom ? (customUrl || `https://${domain}`) : `https://${domain}/${link?.short_code || ''}`;
  const qrSrc = getQRUrl(qrText, size, style.fg, style.bg);

  const handleDownload = async () => {
    toast('Preparing download...', 'info');
    const res = await fetch(qrSrc);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kkoneurl-qr-${size}.png`;
    a.click();
    toast('QR Code downloaded!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      <div>
        <h1 className="text-3xl font-black font-display tracking-tight mb-2">QR Generator</h1>
        <p className="text-white/40 text-sm">Design and download branded QR codes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Controls */}
        <div className="space-y-6">
          <div className="card space-y-6">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
              <button 
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${!useCustom ? 'bg-purple shadow-lg shadow-purple/20 text-white' : 'text-white/40 hover:text-white'}`}
                onClick={() => setUseCustom(false)}
              >My Links</button>
              <button 
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${useCustom ? 'bg-purple shadow-lg shadow-purple/20 text-white' : 'text-white/40 hover:text-white'}`}
                onClick={() => setUseCustom(true)}
              >Custom URL</button>
            </div>

            {useCustom ? (
              <input className="input" placeholder="https://..." value={customUrl} onChange={e => setCustomUrl(e.target.value)} />
            ) : (
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="input !w-full !bg-bg-card border-white/5 flex items-center justify-between group hover:border-purple/50 transition-all text-left"
                >
                  <span className="truncate pr-4">{link?.title || link?.short_code || 'Select a link'}</span>
                  <ChevronDown size={16} className={`text-white/20 group-hover:text-purple transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in py-2 backdrop-blur-xl">
                    {safeLinks.map(l => (
                      <button
                        key={l._id || l.id}
                        type="button"
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 flex flex-col gap-0.5 ${(l._id || l.id) === selected ? 'bg-purple/10 text-purple-light border-l-2 border-purple' : 'text-white/60'}`}
                        onClick={() => {
                          setSelected(l._id || l.id);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="font-bold truncate">{l.title || l.short_code}</span>
                        <span className="text-[10px] opacity-40 truncate">kkoneurl.com/{l.short_code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-bold mb-6 flex items-center gap-2"><Palette size={16} className="text-purple-light" /> Choose Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {QR_STYLES.map(s => (
                <button
                  key={s.id}
                  className={`
                    flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all relative
                    ${style.id === s.id ? 'border-purple bg-purple/10 ring-4 ring-purple/5' : 'border-white/5 bg-white/5 hover:border-white/20'}
                  `}
                  onClick={() => setStyle(s)}
                >
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: s.fg }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{s.label}</span>
                  {style.id === s.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple rounded-full flex items-center justify-center border-4 border-bg-card shadow-lg">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-6">
          <div className="card !p-0 overflow-hidden bg-white/5">
            <div className="p-12 flex flex-col items-center justify-center gap-6" style={{ backgroundColor: style.bg }}>
              <img src={qrSrc} alt="QR" className="w-48 h-48 rounded-2xl shadow-2xl" />
              <div className="flex items-center gap-2 opacity-30 font-display font-black text-xs uppercase tracking-[0.2em]">
                <QrCode size={14} /> kkoneurl
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{useCustom ? 'Custom Link' : (link?.title || link?.short_code)}</h3>
                  <p className="text-xs text-purple-light/70 font-medium truncate max-w-[240px]">{qrText}</p>
                </div>
                <div className="flex gap-2">
                  {QR_SIZES.map(s => (
                    <button key={s} className={`w-10 h-10 rounded-lg text-[10px] font-black border transition-all ${size === s ? 'bg-white text-bg-primary border-white' : 'border-white/10 text-white/40 hover:text-white'}`} onClick={() => setSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary w-full !py-4 !rounded-2xl shadow-glow" onClick={handleDownload}>
                <Download size={18} /> Download High-Res PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;
