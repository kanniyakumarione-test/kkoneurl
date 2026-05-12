import { useState } from 'react';
import { X, Layers, Link2, Zap, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const BatchShortenerModal = ({ onClose, onAddBatch }) => {
  const toast = useToast();
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleBatchShorten = async () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(u => u);
    if (urlList.length === 0) return toast('Please enter at least one URL', 'error');
    if (urlList.length > 10) return toast('Maximum 10 URLs allowed in batch', 'error');

    setLoading(true);
    try {
      const responses = await Promise.all(urlList.map(url => onAddBatch({ originalUrl: url })));
      setResults(responses);
      toast(`Successfully shortened ${responses.length} links!`, 'success');
    } catch (err) {
      toast('Some links failed to shorten', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-bg-card border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="p-8 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan to-blue rounded-2xl flex items-center justify-center shadow-lg shadow-cyan/20">
                <Layers size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-display">Batch Shortener</h2>
                <p className="text-sm text-white/40">Shorten up to 10 URLs at once</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          {!results ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Paste URLs (one per line)</label>
                <textarea 
                  className="input min-h-[200px] resize-none font-mono text-sm py-4" 
                  placeholder="https://google.com&#10;https://github.com&#10;https://youtube.com"
                  value={urls}
                  onChange={e => setUrls(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-purple/5 border border-purple/20 rounded-xl text-xs text-white/60">
                <AlertCircle size={14} className="text-purple-light" />
                <span>Batch links will use random slugs and default settings.</span>
              </div>

              <button 
                className={`btn btn-primary w-full !py-4 !rounded-2xl shadow-glow ${loading ? 'opacity-50' : ''}`}
                onClick={handleBatchShorten}
                disabled={loading}
              >
                {loading ? 'Processing...' : <>Shorten All <Zap size={16} /></>}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                {results.map((link, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/20 truncate">{link.original_url}</p>
                      <p className="text-purple-light font-bold">kkoneurl.kanniyakumarione.com/{link.short_code}</p>
                    </div>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(`https://kkoneurl.kanniyakumarione.com/${link.short_code}`); toast('Copied!', 'success')}}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                    >
                      <Link2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-full !py-4 !rounded-2xl" onClick={onClose}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchShortenerModal;
