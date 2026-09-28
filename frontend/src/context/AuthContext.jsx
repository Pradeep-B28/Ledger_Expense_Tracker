import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

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
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
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

  async function register(username, email, password, currency, consentGiven = true) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          currency,
          consentGiven,
        }),
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

  async function exportData() {
    if (!token) throw new Error('Sign in required to export data');
    const res = await fetch(`${API_BASE}/auth/export-data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to export data');
    }
    return await res.json();
  }

  async function eraseAccount() {
    if (!token) throw new Error('Sign in required to delete account');
    const res = await fetch(`${API_BASE}/auth/erase-account`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to erase account');
    }
    logout();
    return true;
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  function updateCurrency(newCurrency) {
    if (user) {
      const updated = { ...user, currency: newCurrency };
      setUser(updated);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateCurrency,
      exportData,
      eraseAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
