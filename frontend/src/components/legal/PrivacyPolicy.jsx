import { Shield, Lock, FileText, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <article className="panel legal-panel">
      <header className="legal-header">
        <div className="title-with-icon">
          <Shield size={24} className="icon-accent" />
          <h1>Privacy Policy</h1>
        </div>
        <p className="legal-meta">
          <strong>Effective Date:</strong> January 1, 2026 | <strong>Last Updated:</strong> March 2026 | <strong>Jurisdiction:</strong> India (DPDP Act 2023 compliant), GDPR (EU), CCPA (California)
        </p>
      </header>

      <div className="legal-body">
        <section className="legal-section">
          <h2>1. Introduction and Data Fiduciary Identity</h2>
          <p>
            Welcome to Ledger Technologies (&quot;Ledger&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your privacy and are committed to protecting your personal data in strict compliance with the Digital Personal Data Protection Act 2023 (DPDP Act, India), the General Data Protection Regulation (GDPR, EU), and the California Consumer Privacy Act (CCPA).
          </p>
          <p>
            For the purposes of applicable data protection law, the Data Fiduciary is:
          </p>
          <div className="legal-info-card">
            <p><strong>Entity Name:</strong> Ledger Technologies</p>
            <p><strong>Founding Representative:</strong> Pradeep Basha</p>
            <p><strong>Registered Address:</strong> Indiranagar, Bangalore, Karnataka 560038, India</p>
            <p><strong>Corporate Contact:</strong> privacy@ledger.app</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>2. Principle of Data Minimization (What We Collect)</h2>
          <p>
            In strict adherence to data minimization standards, Ledger collects ONLY data strictly necessary to provide personal budgeting and expense tracking services:
          </p>
          <ul className="legal-list">
            <li><strong>Account Identity:</strong> Display username, email address, and cryptographically salted password hash (via bcrypt). We never store raw plain-text passwords.</li>
            <li><strong>Financial Entries:</strong> Transaction titles, categories, amounts, dates, and optional receipt images provided directly and voluntarily by you.</li>
            <li><strong>Application Preferences:</strong> Preferred display currency, UI color theme, and category budget limits.</li>
          </ul>
          <p>
            <strong>What We Never Collect:</strong> We do NOT access your contacts, SMS, microphone, real-time GPS location, bank login credentials, credit card CVVs, or government identification numbers.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Purpose of Processing and Lawful Basis</h2>
          <p>
            Your data is processed exclusively under the lawful basis of informed, explicit consent provided at registration, strictly for the following specified purposes:
          </p>
          <ul className="legal-list">
            <li>Rendering personal expense calculations, budget utilization summaries, and cash flow visualizations.</li>
            <li>Enabling offline storage on your local browser cache with optional encrypted cloud backup.</li>
            <li>Allowing you to generate and export your personal CSV spreadsheets.</li>
          </ul>
          <p>
            We do NOT sell, rent, monetize, or license your personal or financial data to advertisers, data brokers, or third-party marketing companies under any circumstances.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Data Storage, Security, and Offline Architecture</h2>
          <p>
            Ledger implements enterprise-grade technical and organizational safeguards:
          </p>
          <ul className="legal-list">
            <li><strong>Transport Security:</strong> All transit data is strictly encrypted using TLS 1.3 / HTTPS. HTTP requests are automatically redirected to HTTPS in production.</li>
            <li><strong>Authentication:</strong> User sessions are authenticated using scoped, signed JSON Web Tokens (JWT) with secure expiration windows.</li>
            <li><strong>Database Isolation:</strong> All database queries, updates, and deletions are strictly scoped to your authenticated account identifier, preventing any cross-user access or data leakage.</li>
            <li><strong>Offline Storage:</strong> When disconnected, records reside locally on your device in your browser cache. You maintain full control over clearing this cache anytime.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Rights of the Data Principal (Your Rights)</h2>
          <p>
            Under the DPDP Act 2023, GDPR, and CCPA, you hold comprehensive rights over your personal data:
          </p>
          <div className="rights-grid">
            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>Right to Access & Portability</strong>
                <p>Export all your transactions, budgets, and accounts into machine-readable CSV or JSON at any time from your Settings tab.</p>
              </div>
            </div>

            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>Right to Correction & Rectification</strong>
                <p>Modify, update, or edit any profile information or recorded transaction directly within the application.</p>
              </div>
            </div>

            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>Right to Erasure (Account Deletion)</strong>
                <p>Request permanent deletion of your account and all associated transaction records. Deletion is instantaneous and irrevocable.</p>
              </div>
            </div>

            <div className="right-card">
              <CheckCircle2 size={18} className="text-success" />
              <div>
                <strong>Right to Withdraw Consent</strong>
                <p>Revoke processing consent at any time. Upon revocation, processing halts and data is scheduled for immediate deletion.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <h2>6. Grievance Redressal and Data Protection Officer (DPO)</h2>
          <p>
            As mandated by Section 8 and Section 12 of the DPDP Act 2023, Ledger has appointed a dedicated Grievance Redressal Officer to address queries, complaints, and rights requests:
          </p>
          <div className="legal-info-card officer-card">
            <div className="flex-align gap-10 margin-bottom-8">
              <UserCheck size={20} className="icon-accent" />
              <strong>Grievance Redressal Officer & Data Protection Officer</strong>
            </div>
            <p><strong>Name:</strong> Pradeep Basha</p>
            <p><strong>Entity:</strong> Ledger Technologies</p>
            <p><strong>Email:</strong> grievance@ledger.app (or privacy@ledger.app)</p>
            <p><strong>Office Address:</strong> Indiranagar, Bangalore, Karnataka 560038, India</p>
            <p><strong>Turnaround SLA:</strong> Acknowledgment within 24 hours; resolution within 7 working days.</p>
          </div>
          <p className="margin-top-12">
            If you are not satisfied with our resolution, you retain the statutory right to escalate the matter to the Data Protection Board of India (DPBI) or your local supervisory authority.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Updates to This Policy</h2>
          <p>
            We may periodically revise this Privacy Policy to reflect regulatory enhancements or system improvements. Significant modifications will be notified via in-app banner or email notification before taking effect.
          </p>
        </section>
      </div>

      <footer className="legal-footer flex-between">
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
          Back to Dashboard
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('terms')}>
          View Terms of Service
        </button>
      </footer>
    </article>
  );
}
