import { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings, Check, X } from 'lucide-react';

const STORAGE_KEY = 'ledger_cookie_consent';

export default function CookieConsentBanner({ onNavigate, forceOpen, onCloseSettings }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({
          necessary: true,
          functional: Boolean(parsed.functional),
          analytics: Boolean(parsed.analytics),
        });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setShowBanner(true);
      setShowPreferences(true);
    }
  }, [forceOpen]);

  function handleAcceptAll() {
    const consent = {
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
    if (onCloseSettings) onCloseSettings();
  }

  function handleAcceptNecessary() {
    const consent = {
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
    if (onCloseSettings) onCloseSettings();
  }

  function handleSavePreferences() {
    const consent = {
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);
    setShowPreferences(false);
    if (onCloseSettings) onCloseSettings();
  }

  if (!showBanner) return null;

  return (
    <aside className="cookie-banner-wrapper" role="dialog" aria-label="Cookie and Privacy Consent">
      <div className="cookie-banner-card">
        <div className="cookie-banner-content">
          <div className="cookie-icon-wrapper">
            <Cookie size={22} className="icon-accent" />
          </div>

          <div className="cookie-text-content">
            <h3 className="cookie-title">Privacy and Storage Preferences</h3>
            <p className="cookie-desc">
              We use essential local storage keys to keep you securely signed in and cache your transactions for offline speed. In compliance with India&apos;s DPDP Act 2023 and GDPR, we do not deploy third-party advertising or cross-site tracking cookies.
            </p>
            <div className="cookie-links-row">
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onNavigate && onNavigate('cookies')}
              >
                Cookie Policy
              </button>
              <span className="dot-divider">•</span>
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onNavigate && onNavigate('privacy')}
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Preferences Drawer */}
        {showPreferences && (
          <div className="cookie-preferences-drawer">
            <div className="preference-item">
              <div className="preference-info">
                <strong>Strictly Necessary Storage</strong>
                <p>Required for secure authentication, token management, and data integrity. Cannot be disabled.</p>
              </div>
              <input type="checkbox" checked disabled className="pref-checkbox" aria-label="Strictly Necessary" />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <strong>Functional &amp; Theme Preferences</strong>
                <p>Remembers your selected currency, color theme, and offline caching options.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences((p) => ({ ...p, functional: e.target.checked }))}
                className="pref-checkbox"
                aria-label="Functional and Theme Preferences"
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <strong>Anonymous Diagnostics</strong>
                <p>Collects aggregate error metrics to resolve system bugs. Completely optional.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                className="pref-checkbox"
                aria-label="Anonymous Diagnostics"
              />
            </div>
          </div>
        )}

        <div className="cookie-actions-row">
          {showPreferences ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSavePreferences}
            >
              <Check size={14} /> Save My Choices
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPreferences(true)}
            >
              <Settings size={14} /> Custom Preferences
            </button>
          )}

          <div className="actions-right flex-align gap-8">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAcceptNecessary}
            >
              Essential Only
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
