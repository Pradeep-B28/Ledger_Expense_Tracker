import { CreditCard, Shield, Scale, Cookie, RefreshCw, Mail, MapPin } from 'lucide-react';

export default function Footer({ onNavigate, onOpenCookieSettings }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Column 1: Brand & Business Details */}
        <div className="footer-col brand-col">
          <div className="footer-brand flex-align gap-8 margin-bottom-12">
            <div className="footer-logo-badge">
              <CreditCard size={18} className="text-white" />
            </div>
            <strong className="footer-brand-name">Ledger</strong>
          </div>
          <p className="footer-tagline">
            Personal expense tracking, budget management, and offline-first financial bookkeeping.
          </p>
          <div className="footer-business-details margin-top-12">
            <div className="flex-align gap-6 text-muted text-xs margin-bottom-4">
              <MapPin size={12} />
              <span>Ledger Technologies, Bangalore, Karnataka 560038, India</span>
            </div>
            <div className="flex-align gap-6 text-muted text-xs">
              <Mail size={12} />
              <a href="mailto:support@ledger.app" className="footer-link">support@ledger.app</a>
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-nav-list">
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('dashboard')}>Home Overview</button></li>
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('transactions')}>All Expenses</button></li>
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('analytics')}>Insights &amp; Trends</button></li>
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('budgets')}>Budget Limits</button></li>
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('accounts')}>Wallets &amp; Accounts</button></li>
            <li><button type="button" className="footer-btn-link" onClick={() => onNavigate('settings')}>Account Settings</button></li>
          </ul>
        </div>

        {/* Column 3: Legal & Regulatory */}
        <div className="footer-col">
          <h4 className="footer-heading">Compliance &amp; Legal</h4>
          <ul className="footer-nav-list">
            <li>
              <button type="button" className="footer-btn-link flex-align gap-6" onClick={() => onNavigate('privacy')}>
                <Shield size={13} /> Privacy Policy (DPDP Act)
              </button>
            </li>
            <li>
              <button type="button" className="footer-btn-link flex-align gap-6" onClick={() => onNavigate('terms')}>
                <Scale size={13} /> Terms &amp; Conditions
              </button>
            </li>
            <li>
              <button type="button" className="footer-btn-link flex-align gap-6" onClick={() => onNavigate('cookies')}>
                <Cookie size={13} /> Cookie Policy
              </button>
            </li>
            <li>
              <button type="button" className="footer-btn-link flex-align gap-6" onClick={() => onNavigate('refund')}>
                <RefreshCw size={13} /> Refund Policy
              </button>
            </li>
            {onOpenCookieSettings && (
              <li>
                <button type="button" className="footer-btn-link" onClick={onOpenCookieSettings}>
                  Manage Storage Choices
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Column 4: Regulatory Disclosure */}
        <div className="footer-col legal-note-col">
          <h4 className="footer-heading">Regulatory Notice</h4>
          <p className="footer-disclaimer text-xs">
            Ledger is a personal budgeting and expense tracking utility designed for informational convenience. It does not provide certified financial planning, tax advice, or investment recommendations. All computations are derived from user-submitted figures.
          </p>
          <div className="dpo-info-box margin-top-12">
            <span className="text-xs"><strong>Grievance &amp; DPO Contact:</strong> Pradeep (<a href="mailto:grievance@ledger.app" className="footer-link">grievance@ledger.app</a>)</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom flex-between flex-wrap gap-12">
        <p className="copyright-text text-xs">
          &copy; 2026 Ledger Technologies. All rights reserved.
        </p>
        <div className="footer-badges flex-align gap-12 text-xs text-muted">
          <span>DPDP Act 2023 Compliant</span>
          <span>•</span>
          <span>Zero 3rd-Party Tracking</span>
          <span>•</span>
          <span>256-Bit TLS Encryption</span>
        </div>
      </div>
    </footer>
  );
}
