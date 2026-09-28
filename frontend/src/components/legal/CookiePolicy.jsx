import { Cookie, CheckCircle2, XCircle, Settings, ShieldCheck } from 'lucide-react';

export default function CookiePolicy({ onNavigate }) {
  return (
    <article className="panel legal-panel">
      <header className="legal-header">
        <div className="title-with-icon">
          <Cookie size={24} className="icon-accent" />
          <h1>Cookie Policy</h1>
        </div>
        <p className="legal-meta">
          <strong>Effective Date:</strong> January 1, 2026 | <strong>Last Updated:</strong> March 2026 | <strong>Compliance:</strong> DPDP Act 2023, ePrivacy Directive, GDPR
        </p>
      </header>

      <div className="legal-body">
        <section className="legal-section">
          <h2>1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies and web storage technologies (such as HTML5 LocalStorage and SessionStorage) are small data files stored on your browser or device when you access websites or applications. They enable the system to remember your authentication session, retain your currency preference, and cache your transactions for offline access.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. How Ledger Uses Cookies and Web Storage</h2>
          <p>
            Ledger operates under a privacy-first, zero-third-party-tracking architecture. We do NOT use third-party marketing cookies, cross-site profiling trackers, or ad pixels.
          </p>
          <p>The specific storage items utilized are categorized below:</p>

          <div className="cookie-table-wrapper margin-top-16">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Storage Key</th>
                  <th>Category</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>ledger_token</code></td>
                  <td>Strictly Necessary</td>
                  <td>Maintains your authenticated session securely via JSON Web Token (JWT).</td>
                  <td>Persistent until logout or expiry (7 days)</td>
                </tr>
                <tr>
                  <td><code>ledger_user</code></td>
                  <td>Strictly Necessary</td>
                  <td>Stores your display name and email locally to render profile state without redundant API calls.</td>
                  <td>Persistent until logout</td>
                </tr>
                <tr>
                  <td><code>ledger_theme</code></td>
                  <td>Preferences / Functional</td>
                  <td>Remembers your chosen interface color theme (Dark, Light, Mint, Rose, OLED).</td>
                  <td>Persistent</td>
                </tr>
                <tr>
                  <td><code>ledger_currency</code></td>
                  <td>Preferences / Functional</td>
                  <td>Stores your default currency code (USD, INR, EUR, GBP, JPY, CAD, AUD).</td>
                  <td>Persistent</td>
                </tr>
                <tr>
                  <td><code>ledger_cookie_consent</code></td>
                  <td>Strictly Necessary</td>
                  <td>Records your consent choices submitted via the Cookie Consent Banner.</td>
                  <td>1 Year</td>
                </tr>
                <tr>
                  <td><code>ledger_offline_*</code></td>
                  <td>Functional / Performance</td>
                  <td>Caches your transactions, budgets, and savings goals locally to provide 0ms offline capability.</td>
                  <td>Persistent until cache cleared</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="legal-section">
          <h2>3. Zero Third-Party Advertising Trackers</h2>
          <div className="rights-grid">
            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>Zero Ad Trackers</strong>
                <p>We do not embed Facebook/Meta pixels, Google Ads remarketing tags, TikTok pixels, or advertising beacons.</p>
              </div>
            </div>

            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>No Third-Party Analytics Sharing</strong>
                <p>Your budgeting numbers and transaction amounts are never shared with or sent to external data aggregators.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <h2>4. Managing and Clearing Your Cookies</h2>
          <p>
            You have complete sovereignty over your browser storage. You can manage or delete your stored data through the following mechanisms:
          </p>
          <ul className="legal-list">
            <li><strong>In-App Reset:</strong> Navigate to the <em>Settings &gt; Themes &amp; Data</em> tab in Ledger and click <strong>&quot;Reset Local Cache&quot;</strong> to immediately wipe all client-side cached entries.</li>
            <li><strong>Browser Settings:</strong> You can configure your browser (Chrome, Firefox, Safari, Edge) to block cookies, clear site data, or disable local storage entirely. Please note that blocking essential tokens will require you to sign in upon every visit.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Contact Us Regarding Cookies</h2>
          <p>
            If you have questions about our cookie practices or need assistance managing your storage preferences, contact our Data Protection Officer:
          </p>
          <div className="legal-info-card">
            <p><strong>Officer:</strong> Pradeep (Data Protection Officer)</p>
            <p><strong>Email:</strong> privacy@ledger.app</p>
            <p><strong>Entity:</strong> Ledger Technologies, Bangalore, India</p>
          </div>
        </section>
      </div>

      <footer className="legal-footer flex-between">
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
          Back to Dashboard
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('refund')}>
          View Refund Policy
        </button>
      </footer>
    </article>
  );
}
