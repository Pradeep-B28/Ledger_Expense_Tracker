import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  dashboard: 'Home',
  transactions: 'Expenses',
  analytics: 'Insights',
  budgets: 'Budgets & Goals',
  accounts: 'Wallets & Accounts',
  settings: 'Settings',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  cookies: 'Cookie Policy',
  refund: 'Refund Policy',
  notfound: 'Page Not Found',
};

export default function Breadcrumbs({ activeRoute, onNavigate }) {
  if (activeRoute === 'dashboard') return null;

  const isLegal = ['privacy', 'terms', 'cookies', 'refund'].includes(activeRoute);
  const currentLabel = ROUTE_LABELS[activeRoute] || 'Page';

  return (
    <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => onNavigate('dashboard')}
          >
            <Home size={14} />
            <span>Home</span>
          </button>
        </li>

        {isLegal && (
          <li className="breadcrumb-item">
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-static">Legal</span>
          </li>
        )}

        <li className="breadcrumb-item current" aria-current="page">
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current-text">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
}
