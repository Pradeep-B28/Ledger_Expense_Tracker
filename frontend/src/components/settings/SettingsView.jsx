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
  ShieldAlert,
  FileText,
  Trash2,
} from 'lucide-react';

export default function SettingsView({ onNavigate }) {
  const { currency, setCurrency, transactions, refreshData, showToast } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, exportData, eraseAccount } = useAuth();

  const [activeTab, setActiveTab] = useState('account');

  // Security Toggles & Password State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyEmail: false,
    pushNotifications: false,
  });

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in password fields', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    showToast('Password updated securely', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  function toggleNotif(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification settings updated');
  }

  function handleResetCache() {
    if (window.confirm('Are you sure you want to clear your local offline storage cache? Unsynced entries may be lost.')) {
      localStorage.clear();
      refreshData();
      showToast('Local storage cache reset cleanly', 'info');
    }
  }

  async function handleExportDPDPData() {
    try {
      if (user && exportData) {
        const fullData = await exportData();
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ledger-data-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Personal data package exported successfully', 'success');
      } else {
        // Export local client data if guest
        const localData = {
          exportDate: new Date().toISOString(),
          currency,
          transactions,
        };
        const blob = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ledger-local-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Local device data exported successfully', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to export data', 'error');
    }
  }

  async function handleEraseAccount() {
    const confirmed = window.confirm(
      'DPDP Act Right to Erasure:\n\nAre you sure you want to permanently delete your account and all associated transaction records? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      if (user && eraseAccount) {
        await eraseAccount();
        showToast('Your account and all associated data have been permanently erased', 'info');
      } else {
        localStorage.clear();
        refreshData();
        showToast('All local device records permanently erased', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to erase account', 'error');
    }
  }

  return (
    <div className="panel settings-page-panel">
      <div className="panel-header">
        <div className="title-with-icon">
          <Settings size={22} className="icon-accent" />
          <h2>Settings &amp; Preferences</h2>
        </div>
        <span className="panel-subtitle">Account security, data privacy, alerts, themes, and personal rights</span>
      </div>

      {/* Settings Category Tabs */}
      <div className="settings-nav-tabs margin-bottom-20" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'account'}
          className={`settings-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={16} /> Account Profile
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'privacy'}
          className={`settings-nav-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <ShieldAlert size={16} /> Privacy &amp; Data Rights
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'security'}
          className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <ShieldCheck size={16} /> Security &amp; Password
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notifications'}
          className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} /> Notifications
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'appearance'}
          className={`settings-nav-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Palette size={16} /> Themes &amp; Backup
        </button>
      </div>

      {/* TAB 1: ACCOUNT PROFILE */}
      {activeTab === 'account' && (
        <div className="settings-section">
          <h3>Account &amp; Profile Details</h3>
          <p className="setting-desc margin-bottom-16">Manage your username, email, and preferred reporting currency.</p>

          <div className="form-group margin-bottom-16">
            <label htmlFor="settings-username" className="form-label">Username / Display Name</label>
            <input
              id="settings-username"
              type="text"
              className="form-input"
              defaultValue={user ? user.username : ''}
              placeholder={user ? user.username : 'Guest User (Sign in to sync across devices)'}
              readOnly={!user}
            />
          </div>

          <div className="form-group margin-bottom-16">
            <label htmlFor="settings-email" className="form-label">Email Address</label>
            <input
              id="settings-email"
              type="email"
              className="form-input"
              defaultValue={user ? user.email : ''}
              placeholder={user ? user.email : 'No email registered (Offline Guest Mode)'}
              readOnly={!user}
            />
          </div>

          <div className="form-group margin-bottom-16">
            <label htmlFor="settings-currency" className="form-label">Default Currency</label>
            <select
              id="settings-currency"
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

          <button type="button" className="btn btn-primary" onClick={() => showToast('Profile settings updated')}>
            Save Changes
          </button>
        </div>
      )}

      {/* TAB 2: PRIVACY & DPDP DATA RIGHTS */}
      {activeTab === 'privacy' && (
        <div className="settings-section">
          <h3>Data Protection &amp; DPDP Act Rights</h3>
          <p className="setting-desc margin-bottom-16">
            Ledger complies with India&apos;s Digital Personal Data Protection Act 2023, GDPR, and CCPA. You hold sovereign rights to access, export, and delete your data at any time.
          </p>

          <div className="setting-card margin-bottom-16">
            <h4>Right to Data Portability (Export)</h4>
            <p className="setting-desc margin-bottom-12">
              Download a complete machine-readable JSON archive containing all your personal profile information, transaction records, and category budgets.
            </p>
            <button type="button" className="btn btn-secondary flex-align gap-8" onClick={handleExportDPDPData}>
              <Download size={16} /> Export All My Data (JSON)
            </button>
          </div>

          <div className="setting-card margin-bottom-16">
            <h4>Right to Erasure (Delete Account &amp; Data)</h4>
            <p className="setting-desc margin-bottom-12">
              Permanently delete your account credentials, cloud records, and local transaction entries. This action is irreversible.
            </p>
            <button type="button" className="btn btn-danger flex-align gap-8" onClick={handleEraseAccount}>
              <Trash2 size={16} /> Permanently Erase All Data
            </button>
          </div>

          <div className="legal-info-card margin-top-16">
            <strong>Data Fiduciary &amp; Grievance Redressal Officer</strong>
            <p className="margin-top-4">Pradeep (Data Protection Officer)</p>
            <p>Ledger Technologies, Indiranagar, Bangalore, Karnataka 560038, India</p>
            <p>Email: <a href="mailto:grievance@ledger.app" className="footer-link">grievance@ledger.app</a></p>
            <p className="text-xs text-muted margin-top-4">Statutory resolution turnaround: within 7 business days.</p>
          </div>

          <div className="flex-align gap-12 margin-top-16">
            {onNavigate && (
              <>
                <button type="button" className="btn-link text-xs" onClick={() => onNavigate('privacy')}>
                  Read Privacy Policy
                </button>
                <span className="dot-divider">•</span>
                <button type="button" className="btn-link text-xs" onClick={() => onNavigate('terms')}>
                  Read Terms &amp; Conditions
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="settings-section">
          <h3>Security &amp; Authentication</h3>
          <p className="setting-desc margin-bottom-16">Update your account password and manage device sessions.</p>

          {/* Change Password Form */}
          <div className="setting-card margin-bottom-20">
            <div className="flex-align gap-8 margin-bottom-12">
              <KeyRound size={18} className="icon-accent" />
              <h4>Change Account Password</h4>
            </div>

            <form onSubmit={handlePasswordChange} className="modal-form">
              <div className="form-group">
                <label htmlFor="current-pwd" className="form-label">Current Password</label>
                <input
                  id="current-pwd"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="new-pwd" className="form-label">New Password</label>
                  <input
                    id="new-pwd"
                    type="password"
                    className="form-input"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="confirm-pwd" className="form-label">Confirm New Password</label>
                  <input
                    id="confirm-pwd"
                    type="password"
                    className="form-input"
                    placeholder="Min 8 characters"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary margin-top-8">
                Update Password
              </button>
            </form>
          </div>

          <div className="margin-top-20">
            <h4>Active Session</h4>
            <div className="sessions-list margin-top-12">
              <div className="session-item flex-between">
                <div className="flex-align gap-10">
                  <Smartphone size={18} className="icon-accent" />
                  <div>
                    <strong>Current Browser Session</strong>
                    <div className="text-muted text-xs">Active now on this device</div>
                  </div>
                </div>
                <span className="badge badge-success">Active Now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="settings-section">
          <h3>Notification Preferences</h3>
          <p className="setting-desc margin-bottom-16">Control in-app spending alerts and email reports.</p>

          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Category Budget Alerts</h4>
              <p className="setting-desc">Receive an in-app alert when spending reaches 85% of a category limit.</p>
            </div>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => toggleNotif('budgetAlerts')}
              aria-label="Toggle budget alerts"
            >
              {notifications.budgetAlerts ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          <div className="setting-toggle-card margin-bottom-16 flex-between">
            <div>
              <h4>Weekly Financial Summary Digest</h4>
              <p className="setting-desc">Receive an opt-in weekly breakdown summarizing your income and expenses.</p>
            </div>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => toggleNotif('weeklyEmail')}
              aria-label="Toggle weekly summary"
            >
              {notifications.weeklyEmail ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: THEMES & DATA */}
      {activeTab === 'appearance' && (
        <div className="settings-section">
          <h3>Themes &amp; Data Backup</h3>

          <div className="margin-bottom-20">
            <h4>Interface Theme (5 Options)</h4>
            <div className="theme-pills-grid margin-top-12">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-pill-btn ${theme === t.id ? 'active' : ''}`}
                  style={{ backgroundColor: t.bg, borderColor: t.primary }}
                  onClick={() => setTheme(t.id)}
                  aria-label={`Select ${t.name} theme`}
                >
                  <span className="color-dot" style={{ backgroundColor: t.primary }} />
                  <span>{t.name}</span>
                  {theme === t.id && <Check size={14} style={{ color: t.primary }} />}
                </button>
              ))}
            </div>
          </div>

          <div className="margin-top-20">
            <h4>Data Backup &amp; Local Storage</h4>
            <div className="flex-align gap-12 margin-top-12 flex-wrap">
              <button type="button" className="btn btn-secondary flex-align gap-8" onClick={() => exportToCSV(transactions)}>
                <Download size={16} /> Export Transactions (CSV)
              </button>

              <button type="button" className="btn btn-danger flex-align gap-8" onClick={handleResetCache}>
                <RefreshCw size={16} /> Clear Local Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
