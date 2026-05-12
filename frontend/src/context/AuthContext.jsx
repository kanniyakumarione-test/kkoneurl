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
    // Check for redirect result and restore state if available
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          const token = await result.user.getIdToken();
          localStorage.setItem('token', token);
          await loadProfile();
          console.log('Redirect Sign-In Successful:', result.user.email);
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
      // Fallback for browsers/environments where popups are blocked
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error('Google Sign-In Initiation Error:', error);
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
