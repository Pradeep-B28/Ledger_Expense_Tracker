import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_MAP } from '../../utils/formatters';
import { Palette, Wifi, WifiOff, User, Sparkles, Search, Bell, ChevronDown, Briefcase, UserCircle } from 'lucide-react';
import { hapticImpactLight } from '../../utils/haptics';

export default function Header({ onOpenAuth }) {
  const { currency, setCurrency, connected, showToast } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const [workspace, setWorkspace] = useState('Personal'); // 'Personal' | 'Business'

  const toggleWorkspace = () => {
    hapticImpactLight();
    const next = workspace === 'Personal' ? 'Business' : 'Personal';
    setWorkspace(next);
    showToast(`Switched to ${next} Workspace`, 'info');
  };

  const handleAction = (msg) => {
    hapticImpactLight();
    showToast(msg, 'info');
  };

  return (
    <header className="mobile-app-header">
      <div className="mobile-header-brand" onClick={toggleWorkspace}>
        <div className="workspace-switcher">
          {workspace === 'Personal' ? <UserCircle size={16} className="text-primary" /> : <Briefcase size={16} className="text-warning" />}
          <span className="workspace-name">{workspace}</span>
          <ChevronDown size={12} className="text-muted" />
        </div>
      </div>

      <div className="mobile-header-actions">
        <button className="icon-btn sm" onClick={() => handleAction('Search transactions, categories, or insights...')}>
          <Search size={18} />
        </button>
        <button className="icon-btn sm" onClick={() => handleAction('Check your smart alerts')}>
          <Bell size={18} />
          <span className="ai-fab-badge" style={{ top: 2, right: 2 }} />
        </button>

        {/* Auth / Profile Avatar */}
        {user ? (
          <button
            className="mobile-profile-avatar"
            onClick={() => {
              hapticImpactLight();
              logout();
            }}
            title={`Signed in as ${user.username}. Tap to Sign Out.`}
          >
            <span>{user.username.charAt(0).toUpperCase()}</span>
          </button>
        ) : (
          <button className="mobile-auth-btn" onClick={() => {
            hapticImpactLight();
            onOpenAuth();
          }} title="Sign In">
            <User size={16} />
          </button>
        )}
      </div>
    </header>
  );
}

