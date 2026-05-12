import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { INITIAL_BIO_PAGE } from './store/linksStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import Analytics from './pages/Analytics';
import QRCode from './pages/QRCode';
import BioPage from './pages/BioPage';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import ApiDocs from './pages/ApiDocs';
import PublicBio from './pages/PublicBio';
import Auth from './pages/Auth';
import PasswordGate from './pages/PasswordGate';
import RedirectHandler from './pages/RedirectHandler';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CreateLinkModal from './components/CreateLinkModal';
import BatchShortenerModal from './components/BatchShortenerModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import * as api from './api';
import { useToast } from './context/ToastContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-bg-primary">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin, profile } = useAuth();
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-bg-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!profile) return <div className="h-screen w-full flex items-center justify-center bg-bg-primary">Loading...</div>;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const AppLayout = ({ children, onShorten, links }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-bg-primary font-sans text-[#f0f0ff] overflow-x-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} links={links} />
      <div className="flex-1 flex flex-col min-w-0 min-h-dvh overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onShorten={onShorten}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-10 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [links, setLinks] = useState([]);
  const [bioPage, setBioPage] = useState(INITIAL_BIO_PAGE);
  const [showCreate, setShowCreate] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => navigate('/links'),
    'n': () => setShowCreate(true),
    'b': () => setShowBatch(true)
  });

  useEffect(() => {
    if (user && location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    if (location.state?.pendingUrl && user) {
      setInitialUrl(location.state.pendingUrl);
      setShowCreate(true);
      // Clear state to avoid reopening
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  useEffect(() => {
    const loadLinks = async () => {
      if (!user) {
        setLinks([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data } = await api.fetchLinks();
        setLinks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch links:', err);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, [user]);

  const addLink = async (newLinkData) => {
    try {
      const { data } = await api.createLink(newLinkData);
      setLinks(prev => [data, ...(Array.isArray(prev) ? prev : [])]);
      toast('Link created successfully!', 'success');
      return data;
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create link', 'error');
      throw err;
    }
  };

  const deleteLink = async (id) => {
    try {
      await api.deleteLink(id);
      setLinks(prev => (Array.isArray(prev) ? prev : []).filter(l => (l._id || l.id) !== id));
      toast('Link deleted', 'info');
    } catch (err) {
      toast('Delete failed', 'error');
    }
  };

  const toggleLink = async (id) => {
    try {
      const { data } = await api.toggleLinkStatus(id);
      setLinks(prev => (Array.isArray(prev) ? prev : []).map(l => (l._id || l.id) === id ? data : l));
    } catch (err) {
      toast('Toggle failed', 'error');
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <Dashboard links={links} />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/links" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <Links 
                links={links} 
                onDelete={deleteLink} 
                onToggle={toggleLink} 
                onAdd={() => { setInitialUrl(''); setShowCreate(true); }} 
              />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/analytics" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <Analytics links={links} />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/qr" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <QRCode links={links} />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/bio" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <BioPage bioPage={bioPage} setBioPage={setBioPage} />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <Settings />
            </AppLayout>
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute>
            <AppLayout onShorten={() => { setInitialUrl(''); setShowCreate(true); }} links={links}>
              <AdminPanel links={links} />
            </AppLayout>
          </AdminRoute>
        } />

        <Route path="/p/:code" element={<PasswordGate />} />
        <Route path="/@/:username" element={<PublicBio />} />
        <Route path="/@:username" element={<PublicBio />} />
        <Route path="/:code" element={<RedirectHandler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showCreate && (
        <CreateLinkModal
          onClose={() => setShowCreate(false)}
          onAdd={addLink}
          initialUrl={initialUrl}
        />
      )}

      {showBatch && (
        <BatchShortenerModal
          onClose={() => setShowBatch(false)}
          onAddBatch={addLink}
        />
      )}
    </>
  );
}

export default App;
