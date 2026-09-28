import { useApp } from '../../context/AppContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_MAP } from '../../utils/formatters';
import { Palette, Wifi, WifiOff, User, CreditCard } from 'lucide-react';

export default function Header({ onOpenAuth, onNavigate }) {
  const { currency, setCurrency, connected } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div
        className="header-brand"
        onClick={() => onNavigate && onNavigate('dashboard')}
        role="banner"
        style={{ cursor: 'pointer' }}
        title="Ledger Home"
      >
        <div className="brand-logo" aria-hidden="true">
          <CreditCard size={22} className="logo-svg-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-title">Ledger</span>
          <span className="brand-subtitle">Personal Budget &amp; Expense Tracker</span>
        </div>
      </div>

      <div className="header-actions">
        {/* Connection Status */}
        <div
          className={`status-pill ${connected ? 'live' : 'offline'}`}
          title={connected ? 'Connected to Database' : 'Running in Offline Mode'}
          aria-label={connected ? 'Online Sync Active' : 'Offline Mode'}
        >
          {connected ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}
          <span>{connected ? 'Sync Active' : 'Offline'}</span>
        </div>

        {/* Currency Selector */}
        <select
          className="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          aria-label="Select Preferred Currency"
        >
          {Object.keys(CURRENCY_MAP).map((code) => (
            <option key={code} value={code}>
              {CURRENCY_MAP[code].label}
            </option>
          ))}
        </select>

        {/* Multi-Theme Selector */}
        <div className="theme-selector-wrapper flex-align gap-6">
          <Palette size={16} className="text-muted" aria-hidden="true" />
          <select
            className="form-select theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Select Interface Theme"
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
          <div
            className="user-profile-badge"
            onClick={logout}
            title="Click to Sign Out"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') logout(); }}
            aria-label={`Signed in as ${user.username}. Click to sign out.`}
          >
            <div className="avatar" aria-hidden="true">{user.username.charAt(0).toUpperCase()}</div>
            <span className="username-text">{user.username}</span>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAuth}
            aria-label="Sign in to your account"
          >
            <User size={16} aria-hidden="true" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
