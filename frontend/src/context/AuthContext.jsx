import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import * as api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // 👤 Synced Profile
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const { data } = await api.getProfile();
      setProfile({
        displayName: data.display_name,
        username: data.username,
        avatar: data.avatar,
        bio: data.bio,
        settings: data.settings,
        isAdmin: data.is_admin === true
      });
    } catch (err) {
      console.error('AuthContext: Failed to load profile', err);
    }
  };

  useEffect(() => {
    // Listen for changes on auth state (logged in, signed out, etc.)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('token', token);
        await loadProfile();
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Switched to redirect to avoid popup/iframe security issues
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshProfile = () => loadProfile();
  const isAdmin = profile?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, profile, loginWithGoogle, logout, loading, refreshProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
