import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onNavigate }) {
  const { login, register } = useAuth();
  const { showToast } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && !consentAgreed) {
      setError('You must accept the DPDP Act Privacy Policy and Terms to create an account.');
      return;
    }

    try {
      if (isRegister) {
        await register(username, email, password, 'USD', consentAgreed);
        showToast(`Account created for ${username}. Welcome to Ledger.`);
      } else {
        await login(email, password);
        showToast('Signed in successfully.');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  }

  function handleGuestMode() {
    showToast('Continuing in offline guest mode. Data stored on device.');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? 'Create Your Account' : 'Sign In to Ledger'}>
      <div className="auth-container">
        {/* Toggle Segmented Tabs */}
        <div className="segmented-control full-width margin-bottom-20" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={`segment-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={`segment-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="error-alert margin-bottom-16" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-username" className="form-label">Username / Display Name</label>
              <div className="input-group">
                <span className="input-prefix" aria-hidden="true">
                  <User size={16} />
                </span>
                <input
                  id="auth-username"
                  type="text"
                  className="form-input"
                  placeholder="e.g. pradeep"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isRegister}
                  autoComplete="username"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-prefix" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-prefix" aria-hidden="true">
                <Lock size={16} />
              </span>
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          {/* Form Consent Checkbox for DPDP Act 2023 */}
          {isRegister && (
            <div className="consent-checkbox-group margin-top-12 margin-bottom-12">
              <label className="checkbox-label" htmlFor="consent-checkbox">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="consent-checkbox"
                />
                <span className="consent-text text-xs">
                  I consent to the collection and processing of my personal data strictly for expense tracking under India&apos;s DPDP Act 2023, and agree to the{' '}
                  <button
                    type="button"
                    className="inline-legal-link"
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate('terms');
                    }}
                  >
                    Terms
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="inline-legal-link"
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate('privacy');
                    }}
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary full-width margin-top-12">
            {isRegister ? 'Create My Account' : 'Sign In to Account'}
          </button>
        </form>

        <div className="auth-divider margin-top-16">
          <span>GUEST ACCESS</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary full-width flex-center gap-8 margin-top-12"
          onClick={handleGuestMode}
        >
          <ShieldCheck size={16} />
          <span>Continue in Offline Guest Mode</span>
        </button>
      </div>
    </Modal>
  );
}
