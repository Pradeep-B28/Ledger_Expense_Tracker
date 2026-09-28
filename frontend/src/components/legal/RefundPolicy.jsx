import { RefreshCw, CheckCircle2, HelpCircle, Mail, DollarSign } from 'lucide-react';

export default function RefundPolicy({ onNavigate }) {
  return (
    <article className="panel legal-panel">
      <header className="legal-header">
        <div className="title-with-icon">
          <RefreshCw size={24} className="icon-accent" />
          <h1>Refund and Cancellation Policy</h1>
        </div>
        <p className="legal-meta">
          <strong>Effective Date:</strong> January 1, 2026 | <strong>Last Updated:</strong> March 2026 | <strong>Entity:</strong> Ledger Technologies
        </p>
      </header>

      <div className="legal-body">
        <section className="legal-section">
          <h2>1. Overview and Customer Commitment</h2>
          <p>
            At Ledger Technologies (&quot;Ledger&quot;), we strive to provide dependable personal budgeting and financial tracking tools. We believe in transparent, straightforward billing and back all paid services with a fair, reliable refund policy.
          </p>
          <div className="legal-callout success">
            <div className="flex-align gap-8 margin-bottom-8">
              <CheckCircle2 size={20} className="text-success" />
              <h3>Free Tier Commitment</h3>
            </div>
            <p>
              Core offline expense tracking, unlimited local transactions, CSV export, and category budgeting are 100% free forever. No credit card is required to use the free version of Ledger.
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>2. 14-Day Money-Back Guarantee</h2>
          <p>
            For any optional premium cloud synchronization tiers, expanded multi-device backup subscriptions, or enterprise licenses, we offer a <strong>14-day full money-back guarantee</strong>:
          </p>
          <ul className="legal-list">
            <li><strong>Eligibility Window:</strong> You may request a full, no-questions-asked refund within 14 calendar days from the date of your initial purchase or subscription renewal.</li>
            <li><strong>100% Refund:</strong> Approved refunds return 100% of the purchase amount to your original payment method.</li>
            <li><strong>No Hidden Cancellation Penalties:</strong> There are no cancellation fees, administrative deductions, or clawbacks.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How to Request a Refund</h2>
          <p>
            Requesting a refund is simple and fast. Follow these three steps:
          </p>
          <div className="steps-cards-grid margin-top-16">
            <div className="step-card">
              <span className="step-number">1</span>
              <h4>Send Request</h4>
              <p>Email our billing team at <strong>billing@ledger.app</strong> from the email address registered with your Ledger account.</p>
            </div>

            <div className="step-card">
              <span className="step-number">2</span>
              <h4>Include Details</h4>
              <p>Mention your account username and order reference or payment transaction receipt number.</p>
            </div>

            <div className="step-card">
              <span className="step-number">3</span>
              <h4>Fast Processing</h4>
              <p>Our billing team reviews and acknowledges your request within 24 hours. Refunds are initiated immediately upon approval.</p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <h2>4. Refund Turnaround Timelines</h2>
          <p>
            Once our billing team approves your refund, payment gateways process the funds back to your original payment instrument in accordance with standard banking cycles:
          </p>
          <ul className="legal-list">
            <li><strong>UPI &amp; Instant Bank Transfers (India):</strong> 2 to 4 business days.</li>
            <li><strong>Credit &amp; Debit Cards (Visa, MasterCard, RuPay):</strong> 5 to 7 business days depending on your issuing bank.</li>
            <li><strong>Net Banking &amp; Digital Wallets:</strong> 3 to 5 business days.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Subscription Cancellations</h2>
          <p>
            You can cancel any recurring plan anytime through your account settings. Upon cancellation, your subscription remains active until the end of your current billing period, after which it will not renew. You will retain full access to your data and revert to the free offline tier without interruption.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Billing Support Contact</h2>
          <p>
            For any billing questions, payment receipt requests, or tax invoice inquiries, reach out to our accounts desk:
          </p>
          <div className="legal-info-card">
            <p><strong>Department:</strong> Ledger Billing &amp; Subscriptions</p>
            <p><strong>Email:</strong> billing@ledger.app</p>
            <p><strong>Business Address:</strong> Ledger Technologies, Indiranagar, Bangalore, Karnataka 560038, India</p>
          </div>
        </section>
      </div>

      <footer className="legal-footer flex-between">
        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
          Back to Dashboard
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('privacy')}>
          View Privacy Policy
        </button>
      </footer>
    </article>
  );
}
