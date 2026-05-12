import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RedirectHandler = () => {
  const { code } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        if (!code) {
          setError(true);
          return;
        }

        // Guard against @username paths accidentally flowing into short-link redirects.
        if (code.startsWith('@')) {
          window.location.replace(`/@/${code.substring(1)}`);
          return;
        }

        // We just redirect to the backend endpoint which handles the logic
        // This ensures tracking and password gates work correctly
        const apiUrl = import.meta.env.VITE_API_URL || 'https://kkoneurlorig.vercel.app/api';
        const backendRoot = apiUrl.replace(/\/api$/, '');
        window.location.replace(`${backendRoot}/${code}${window.location.search}`);
      } catch (err) {
        setError(true);
      }
    };
    handleRedirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">404</h1>
          <p className="text-white/40">Link not found or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-light font-bold text-sm tracking-widest uppercase">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
