import { useState, useEffect } from 'react';
import { X, Tag, Plus, Check, Folder } from 'lucide-react';
import * as api from '../api';
import { useToast } from '../context/ToastContext';

const MoveToBundleModal = ({ link, onClose, onUpdate }) => {
  const toast = useToast();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBundle, setNewBundle] = useState({ name: '', color: '#6c63ff' });

  useEffect(() => {
    const loadBundles = async () => {
      try {
        const { data } = await api.fetchBundles();
        setBundles(data);
      } catch (err) {
        toast('Failed to load bundles', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadBundles();
  }, []);

  const handleMove = async (bundleId) => {
    try {
      await api.moveLinkToBundle(link._id || link.id, bundleId);
      toast('Link moved to bundle! 📦', 'success');
      onUpdate();
      onClose();
    } catch (err) {
      toast('Move failed', 'error');
    }
  };

  const handleCreate = async () => {
    if (!newBundle.name) return;
    try {
      const { data } = await api.createBundle(newBundle);
      setBundles([...bundles, data]);
      setShowCreate(false);
      setNewBundle({ name: '', color: '#6c63ff' });
      toast('Bundle created!', 'success');
    } catch (err) {
      toast('Create failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-bg-card border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-cyan/10 text-cyan rounded-xl flex items-center justify-center">
                <Tag size={20} />
              </div>
              <h2 className="text-xl font-black font-display">Move to Bundle</h2>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          <p className="text-xs text-white/40 mb-6 italic">Organize "{link.title || link.short_code}" into a folder for bulk analytics.</p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
            {bundles.map(bundle => (
              <button 
                key={bundle.id}
                onClick={() => handleMove(bundle.id)}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-cyan/40 hover:bg-cyan/5 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bundle.color }} />
                  <span className="font-bold text-sm">{bundle.name}</span>
                </div>
                {link.bundle_id === bundle.id ? <Check size={16} className="text-cyan" /> : <Folder size={16} className="text-white/10 group-hover:text-cyan" />}
              </button>
            ))}

            {bundles.length === 0 && !loading && (
              <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-white/20 uppercase tracking-widest font-black">No bundles yet</p>
              </div>
            )}
          </div>

          {showCreate ? (
            <div className="mt-6 p-4 bg-black/20 rounded-2xl border border-white/5 space-y-4 animate-fade-in">
              <input 
                className="input !bg-transparent" 
                placeholder="Bundle Name (e.g. Summer Ads)" 
                value={newBundle.name}
                onChange={e => setNewBundle({...newBundle, name: e.target.value})}
                autoFocus
              />
              <div className="flex justify-between gap-2">
                <button className="btn btn-secondary flex-1 !py-2" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn btn-primary flex-1 !py-2" onClick={handleCreate}>Create</button>
              </div>
            </div>
          ) : (
            <button 
              className="w-full mt-6 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 hover:border-cyan/40 hover:text-cyan rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={16} /> Create New Bundle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoveToBundleModal;
