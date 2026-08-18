import { useApp } from '../../context/AppContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_MAP } from '../../utils/formatters';
import { Palette, Wifi, WifiOff, User } from 'lucide-react';

export default function Header({ onOpenAuth }) {
  const { currency, setCurrency, connected } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <span className="logo-icon">💳</span>
        </div>
        <div className="brand-text">
          <h1>Ledger</h1>
          <span className="brand-subtitle">Personal Budget & Expense Tracker</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Connection Status */}
        <div className={`status-pill ${connected ? 'live' : 'offline'}`} title={connected ? 'Connected to MongoDB Database' : 'Running Offline Mode'}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{connected ? 'Sync On' : 'Offline'}</span>
        </div>

        {/* Currency Selector */}
        <select
          className="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {Object.keys(CURRENCY_MAP).map((code) => (
            <option key={code} value={code}>
              {CURRENCY_MAP[code].label}
            </option>
          ))}
        </select>

        {/* Multi-Theme Selector */}
        <div className="theme-selector-wrapper flex-align gap-6">
          <Palette size={16} className="text-muted" />
          <select
            className="form-select theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auth / Profile */}
        {user ? (
          <div className="user-profile-badge" onClick={logout} title="Click to Sign Out">
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span className="username-text">{user.username}</span>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
            <User size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
