import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || (window.Capacitor?.isNativePlatform?.() ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('ledger_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ledger_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ledger_token', token);
    } else {
      localStorage.removeItem('ledger_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ledger_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ledger_user');
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(username, email, password, currency) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, currency }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  async function googleLogin() {
    setLoading(true);
    try {
      // Simulate Google OAuth response
      const mockGoogleUser = {
        id: 'google-' + Date.now(),
        username: 'Google User',
        email: 'user@gmail.com',
        avatar: 'G',
        currency: 'USD'
      };

      // Delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(mockGoogleUser);
      setToken('mock-google-jwt-token');
      return mockGoogleUser;
    } finally {
      setLoading(false);
    }
  }

  function updateCurrency(newCurrency) {
    if (user) {
      const updated = { ...user, currency: newCurrency };
      setUser(updated);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateCurrency }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
