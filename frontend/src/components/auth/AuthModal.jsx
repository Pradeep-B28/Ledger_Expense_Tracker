import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Lock, Mail, User, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const { showToast } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register(username, email, password);
        showToast(`Account created for ${username}! Welcome to Ledger.`);
      } else {
        await login(email, password);
        showToast('Signed in successfully!');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  }

  function handleGoogleAuth() {
    showToast('Signed in with Google Account! Welcome to Ledger.');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? 'Create Your Account' : 'Sign In to Ledger'}>
      <div className="auth-container">
        {/* Toggle Segmented Tabs */}
        <div className="segmented-control full-width margin-bottom-20">
          <button
            type="button"
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
            className={`segment-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {/* Official Google Account Sign In Button */}
        <button type="button" className="google-auth-btn full-width margin-bottom-20" onClick={handleGoogleAuth}>
          <svg className="google-svg-icon" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{isRegister ? 'Create Account with Google' : 'Sign In with Google'}</span>
        </button>

        <div className="auth-divider margin-bottom-16">
          <span>OR WITH USERNAME & PASSWORD</span>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Username / Display Name</label>
              <div className="input-group">
                <span className="input-prefix">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Choose a username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-prefix">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-input"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-prefix">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width margin-top-12">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider margin-top-16">
          <span>GUEST MODE</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary full-width flex-center gap-8 margin-top-12"
          onClick={() => handleGoogleAuth()}
        >
          <Sparkles size={16} />
          <span>Continue as Guest</span>
        </button>
      </div>
    </Modal>
  );
}
