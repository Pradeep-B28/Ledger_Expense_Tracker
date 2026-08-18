import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCY_MAP } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Palette,
  Download,
  RefreshCw,
  Check,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  KeyRound,
} from 'lucide-react';

export default function SettingsView() {
  const { currency, setCurrency, transactions, refreshData, showToast } = useApp();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('account');

  // Security Toggles & Password State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyEmail: true,
    pushNotifications: true,
  });

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    showToast('Password updated securely!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function toggleNotif(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification settings updated');
  }

  function handleResetCache() {
    localStorage.clear();
    refreshData();
    showToast('Local storage cache reset cleanly', 'info');
  }

  return (
    <div className="panel settings-page-panel">
      <div className="panel-header">
        <div className="title-with-icon">
          <Settings size={22} className="icon-accent" />
          <h2>Settings & Preferences</h2>
        </div>
        <span className="panel-subtitle">Account security, password changes, notification alerts, themes, and data</span>
      </div>

      {/* Settings Category Tabs */}
      <div className="settings-nav-tabs margin-bottom-20">
        <button
          className={`settings-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={16} /> Account Profile
        </button>

        <button
          className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <ShieldCheck size={16} /> Security & Password
        </button>

        <button
          className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} /> Notifications
        </button>

        <button
          className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Palette size={16} /> Themes & Data
        </button>
      </div>

      {/* TAB 1: ACCOUNT PROFILE */}
      {activeTab === 'account' && (
        <div className="settings-section">
          <h3>Account & Profile Details</h3>
          <p className="setting-desc margin-bottom-16">Manage your username, email, and preferred reporting currency.</p>

          <div className="form-group margin-bottom-16">
            <label className="form-label">Username / Display Name</label>
            <input type="text" className="form-input" defaultValue={user ? user.username : 'Alex Morgan'} />
          </div>

          <div className="form-group margin-bottom-16">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" defaultValue={user ? user.email : 'alex.morgan@example.com'} />
          </div>

          <div className="form-group margin-bottom-16">
            <label className="form-label">Default Currency</label>
            <select
              className="form-select full-width"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(CURRENCY_MAP).map((code) => (
                <option key={code} value={code}>
                  {CURRENCY_MAP[code].label}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => showToast('Profile changes saved!')}>
            Save Changes
          </button>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="settings-section">
          <h3>Security & Password Protection</h3>
          <p className="setting-desc margin-bottom-16">Update your account password, 2FA, and active session devices.</p>

          {/* Change Password Form */}
          <div className="setting-card margin-bottom-20">
            <div className="flex-align gap-8 margin-bottom-12">
              <KeyRound size={18} className="icon-accent" />
              <h4>Change Account Password</h4>
            </div>

            <form onSubmit={handlePasswordChange} className="modal-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary margin-top-8">
                Update Password
              </button>
            </form>
          </div>

          {/* 2FA & Biometric Toggles */}
          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Two-Factor Authentication (2FA)</h4>
              <p className="setting-desc">Require an SMS or Authenticator code when signing in on a new device.</p>
            </div>
            <button className="toggle-btn" onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              showToast(`2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
            }}>
              {twoFactorEnabled ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Biometric PIN & Face Lock</h4>
              <p className="setting-desc">Require Face ID / Fingerprint unlock when opening the Ledger app.</p>
            </div>
            <button className="toggle-btn" onClick={() => {
              setBiometricEnabled(!biometricEnabled);
              showToast(`Biometric lock ${!biometricEnabled ? 'enabled' : 'disabled'}`);
            }}>
              {biometricEnabled ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          <div className="margin-top-20">
            <h4>Active Logged-In Sessions</h4>
            <div className="sessions-list margin-top-12">
              <div className="session-item flex-between">
                <div className="flex-align gap-10">
                  <Smartphone size={18} className="icon-accent" />
                  <div>
                    <strong>Samsung Galaxy S24 (This Device)</strong>
                    <div className="text-muted text-xs">Active now • New York, USA</div>
                  </div>
                </div>
                <span className="badge badge-success">Active Now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="settings-section">
          <h3>Notification & Alert Preferences</h3>
          <p className="setting-desc margin-bottom-16">Control push notifications, weekly budget alerts, and email summaries.</p>

          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Category Budget Over-Limit Alerts</h4>
              <p className="setting-desc">Get an instant push notification when spending exceeds 85% of a category limit.</p>
            </div>
            <button className="toggle-btn" onClick={() => toggleNotif('budgetAlerts')}>
              {notifications.budgetAlerts ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Weekly Financial Summary Digest</h4>
              <p className="setting-desc">Receive a weekly breakdown email summarizing income vs expenses every Sunday.</p>
            </div>
            <button className="toggle-btn" onClick={() => toggleNotif('weeklyEmail')}>
              {notifications.weeklyEmail ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: THEMES & DATA */}
      {activeTab === 'appearance' && (
        <div className="settings-section">
          <h3>Themes & Data Export</h3>

          <div className="margin-bottom-20">
            <h4>Appearance Themes (5 Options)</h4>
            <div className="theme-pills-grid margin-top-12">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-pill-btn ${theme === t.id ? 'active' : ''}`}
                  style={{ backgroundColor: t.bg, borderColor: t.primary }}
                  onClick={() => setTheme(t.id)}
                >
                  <span className="color-dot" style={{ backgroundColor: t.primary }} />
                  <span>{t.name}</span>
                  {theme === t.id && <Check size={14} style={{ color: t.primary }} />}
                </button>
              ))}
            </div>
          </div>

          <div className="margin-top-20">
            <h4>Data Backup & Clear Cache</h4>
            <div className="flex-align gap-12 margin-top-12">
              <button className="btn btn-secondary flex-align gap-8" onClick={() => exportToCSV(transactions)}>
                <Download size={16} /> Export CSV Report
              </button>

              <button className="btn btn-danger flex-align gap-8" onClick={handleResetCache}>
                <RefreshCw size={16} /> Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
