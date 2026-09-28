import { AlertCircle, Home, ArrowLeft, CreditCard, Target, PieChart } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div className="panel not-found-panel">
      <div className="not-found-content">
        <div className="not-found-icon-wrapper">
          <AlertCircle size={48} className="text-warning" />
        </div>

        <span className="not-found-code">404 ERROR</span>
        <h1>Page Not Found</h1>
        <p className="not-found-desc">
          The page or resource you requested could not be found. It may have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="not-found-cta-row">
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
            <Home size={16} /> Return to Dashboard
          </button>
        </div>

        <div className="not-found-links-section">
          <h3>Quick Navigation</h3>
          <div className="not-found-grid">
            <button type="button" className="nav-shortcut-card" onClick={() => onNavigate('transactions')}>
              <CreditCard size={18} className="icon-accent" />
              <span>All Expenses</span>
            </button>
            <button type="button" className="nav-shortcut-card" onClick={() => onNavigate('analytics')}>
              <PieChart size={18} className="icon-accent" />
              <span>Financial Insights</span>
            </button>
            <button type="button" className="nav-shortcut-card" onClick={() => onNavigate('budgets')}>
              <Target size={18} className="icon-accent" />
              <span>Budget Limits</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
