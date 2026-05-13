import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
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
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        username: data.username,
        avatar: data.avatar,
        bio: data.bio,
        settings: data.settings,
        plan: data.plan || 'free',
        isAdmin: data.is_admin === true
      });
    } catch (err) {
      console.error('AuthContext: Failed to load profile', err);
    }
  };

  useEffect(() => {
    // Check for redirect result and restore state if available
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          const token = await result.user.getIdToken();
          localStorage.setItem('token', token);
          await loadProfile();
        }
      })
      .catch((error) => {
        console.error('Redirect Sign-In Error:', error.code, error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for changes on auth state
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
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
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
