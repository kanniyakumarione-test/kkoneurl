import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) loadProfile();
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        localStorage.setItem('token', session.access_token);
        loadProfile();
      } else {
        localStorage.removeItem('token');
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = () => loadProfile();
  const isAdmin = profile?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, profile, login, register, logout, loading, refreshProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
