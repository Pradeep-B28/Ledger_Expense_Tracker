import { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Breadcrumbs from './components/common/Breadcrumbs';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import Modal from './components/common/Modal';
import NotFound from './components/common/NotFound';

import OverviewCards from './components/dashboard/OverviewCards';
import FinancialHealthScore from './components/dashboard/FinancialHealthScore';
import HomeAddExpenseBar from './components/dashboard/HomeAddExpenseBar';
import RecentActivity from './components/dashboard/RecentActivity';

import TransactionList from './components/transactions/TransactionList';
import TransactionFormModal from './components/transactions/TransactionFormModal';

import CategoryDonutChart from './components/analytics/CategoryDonutChart';
import IncomeVsExpenseChart from './components/analytics/IncomeVsExpenseChart';
import SpendingTrendChart from './components/analytics/SpendingTrendChart';
import FinancialInsightsCard from './components/analytics/FinancialInsightsCard';

import BudgetCard from './components/budgets/BudgetCard';
import BudgetFormModal from './components/budgets/BudgetFormModal';
import SavingsGoalCard from './components/budgets/SavingsGoalCard';
import SavingsGoalFormModal from './components/budgets/SavingsGoalFormModal';

import WalletCard from './components/accounts/WalletCard';
import AccountModal from './components/accounts/AccountModal';
import ConnectBankModal from './components/accounts/ConnectBankModal';

import AuthModal from './components/auth/AuthModal';
import SettingsView from './components/settings/SettingsView';
import AIChatbot from './components/chat/AIChatbot';

import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsAndConditions from './components/legal/TermsAndConditions';
import CookiePolicy from './components/legal/CookiePolicy';
import RefundPolicy from './components/legal/RefundPolicy';
import CookieConsentBanner from './components/legal/CookieConsentBanner';

import { Plus, Cloud, Landmark } from 'lucide-react';

const ROUTE_CONFIG = {
  dashboard: {
    path: '/',
    title: 'Ledger | Personal Expense Tracker & Budget Manager',
    desc: 'Private, offline-first personal expense tracker, category budget manager, and savings goal planner. DPDP Act 2023 compliant.',
  },
  transactions: {
    path: '/transactions',
    title: 'Expenses & Income | Ledger',
    desc: 'Track and categorize all personal expenses and income records with receipt attachments.',
  },
  analytics: {
    path: '/analytics',
    title: 'Financial Insights & Trends | Ledger',
    desc: 'Deep financial insights, monthly category spending breakdowns, and net savings analytics.',
  },
  budgets: {
    path: '/budgets',
    title: 'Budget Limits & Savings Goals | Ledger',
    desc: 'Set category spending limits and track savings milestones for vacations, reserves, and major purchases.',
  },
  accounts: {
    path: '/accounts',
    title: 'Wallets & Bank Accounts | Ledger',
    desc: 'Manage checking accounts, credit cards, and offline cash wallets.',
  },
  settings: {
    path: '/settings',
    title: 'Settings & Privacy Rights | Ledger',
    desc: 'Account security, appearance themes, DPDP Act data export, and erasure rights.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Ledger Technologies',
    desc: 'DPDP Act 2023 and GDPR compliant privacy policy. Data minimization, no 3rd-party tracking.',
  },
  terms: {
    path: '/terms',
    title: 'Terms and Conditions | Ledger Technologies',
    desc: 'Terms of service and strict financial disclaimer. Ledger does not provide financial or tax advice.',
  },
  cookies: {
    path: '/cookies',
    title: 'Cookie Policy | Ledger Technologies',
    desc: 'Transparent disclosure of local storage tokens and zero third-party tracking policy.',
  },
  refund: {
    path: '/refund',
    title: 'Refund Policy | Ledger Technologies',
    desc: '14-day no-questions-asked refund policy on paid subscriptions.',
  },
  notfound: {
    path: '/404',
    title: '404 Page Not Found | Ledger',
    desc: 'The requested page could not be found.',
  },
};

function getRouteFromPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/dashboard') return 'dashboard';
  if (clean === '/transactions' || clean === '/expenses') return 'transactions';
  if (clean === '/analytics' || clean === '/insights') return 'analytics';
  if (clean === '/budgets') return 'budgets';
  if (clean === '/accounts' || clean === '/wallets') return 'accounts';
  if (clean === '/settings') return 'settings';
  if (clean === '/privacy') return 'privacy';
  if (clean === '/terms') return 'terms';
  if (clean === '/cookies') return 'cookies';
  if (clean === '/refund') return 'refund';
  return 'notfound';
}

export default function App() {
  const { activeTab, setActiveTab, budgets, goals, accounts, toast } = useApp();

  // Browser path-based routing state
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'dashboard';
  });

  // Modals state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  // Lightbox Receipt Modal
  const [activeReceiptUrl, setActiveReceiptUrl] = useState(null);

  // Sync navigation
  function navigate(targetRoute) {
    const config = ROUTE_CONFIG[targetRoute] || ROUTE_CONFIG.dashboard;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', config.path);
    }
    setCurrentRoute(targetRoute);
    if (['dashboard', 'transactions', 'analytics', 'budgets', 'accounts', 'settings'].includes(targetRoute)) {
      setActiveTab(targetRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    function handlePopState() {
      const route = getRouteFromPath(window.location.pathname);
      setCurrentRoute(route);
      if (['dashboard', 'transactions', 'analytics', 'budgets', 'accounts', 'settings'].includes(route)) {
        setActiveTab(route);
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveTab]);

  // Keep activeTab from AppContext in sync when clicked via Navbar
  useEffect(() => {
    if (['dashboard', 'transactions', 'analytics', 'budgets', 'accounts', 'settings'].includes(activeTab)) {
      const config = ROUTE_CONFIG[activeTab];
      if (config && currentRoute !== activeTab && !['privacy', 'terms', 'cookies', 'refund', 'notfound'].includes(currentRoute)) {
        if (typeof window !== 'undefined' && window.location.pathname !== config.path) {
          window.history.pushState({}, '', config.path);
        }
        setCurrentRoute(activeTab);
      }
    }
  }, [activeTab, currentRoute]);

  // Dynamic SEO meta tags and Title
  useEffect(() => {
    const cfg = ROUTE_CONFIG[currentRoute] || ROUTE_CONFIG.notfound;
    document.title = cfg.title;

    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', cfg.desc);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://ledger.local${cfg.path}`);
    }
  }, [currentRoute]);

  return (
    <div className="app-shell">
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        onNavigate={navigate}
      />
      <Navbar />

      <main className="app-main-content">
        <Breadcrumbs activeRoute={currentRoute} onNavigate={navigate} />

        {/* TAB 1: HOME OVERVIEW */}
        {currentRoute === 'dashboard' && (
          <div className="tab-view dashboard-view">
            <OverviewCards />

            {/* ADJACENT SIDE-BY-SIDE GRID */}
            <div className="dashboard-adjacent-grid margin-top-16">
              {/* Column 1: Add New Record Form */}
              <div className="adjacent-col">
                <HomeAddExpenseBar onOpenFullModal={() => setShowAddTxModal(true)} />
              </div>

              {/* Column 2: Expense by Category Chart & Breakdown List */}
              <div className="adjacent-col">
                <CategoryDonutChart />
              </div>

              {/* Column 3: Recent Live Activity Feed */}
              <div className="adjacent-col">
                <RecentActivity onViewReceipt={(url) => setActiveReceiptUrl(url)} />
              </div>
            </div>

            {/* Monthly Financial Pulse */}
            <div className="margin-top-16">
              <FinancialHealthScore />
            </div>
          </div>
        )}

        {/* TAB 2: EXPENSES */}
        {currentRoute === 'transactions' && (
          <div className="tab-view transactions-view">
            <TransactionList
              onOpenAddModal={() => setShowAddTxModal(true)}
              onViewReceipt={(url) => setActiveReceiptUrl(url)}
            />
          </div>
        )}

        {/* TAB 3: INSIGHTS */}
        {currentRoute === 'analytics' && (
          <div className="tab-view analytics-view">
            <FinancialInsightsCard />

            <div className="grid-2-col margin-top-20">
              <CategoryDonutChart />
              <IncomeVsExpenseChart />
            </div>

            <div className="margin-top-20">
              <SpendingTrendChart />
            </div>
          </div>
        )}

        {/* TAB 4: BUDGETS & SAVINGS GOALS */}
        {currentRoute === 'budgets' && (
          <div className="tab-view budgets-view">
            {/* Category Budgets Section */}
            <div className="panel">
              <div className="panel-header flex-between">
                <div>
                  <h2>Category Spending Limits</h2>
                  <span className="panel-subtitle">Set maximum expenditure thresholds per category</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowAddBudgetModal(true)}>
                  <Plus size={16} /> Add Budget Limit
                </button>
              </div>

              {budgets.length === 0 ? (
                <div className="empty-state">
                  <p>No spending limits set yet. Click above to define a budget.</p>
                </div>
              ) : (
                <div className="budgets-grid margin-top-16">
                  {budgets.map((b) => (
                    <BudgetCard key={b._id} budget={b} />
                  ))}
                </div>
              )}
            </div>

            {/* Savings Goals Section */}
            <div className="panel margin-top-24">
              <div className="panel-header flex-between">
                <div>
                  <h2>Target Savings Goals</h2>
                  <span className="panel-subtitle">Track progress towards vacations, emergency reserves, and big purchases</span>
                </div>
                <button type="button" className="btn btn-success" onClick={() => setShowAddGoalModal(true)}>
                  <Plus size={16} /> Create Savings Goal
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="empty-state">
                  <p>No savings goals created. Start saving towards a target today!</p>
                </div>
              ) : (
                <div className="goals-grid margin-top-16">
                  {goals.map((g) => (
                    <SavingsGoalCard key={g._id} goal={g} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ACCOUNTS / WALLETS */}
        {currentRoute === 'accounts' && (
          <div className="tab-view accounts-view">
            <div className="panel">
              <div className="panel-header flex-between flex-wrap gap-12">
                <div>
                  <h2>Wallets &amp; Bank Accounts</h2>
                  <span className="panel-subtitle">Manage checking accounts, offline cash wallets, and cloud bank accounts</span>
                </div>

                <div className="flex-align gap-10">
                  <button type="button" className="btn btn-secondary flex-align gap-6" onClick={() => setShowAddAccountModal(true)}>
                    <Plus size={16} /> Add Manual Wallet (Offline)
                  </button>
                  <button type="button" className="btn btn-primary flex-align gap-6" onClick={() => setShowConnectBankModal(true)}>
                    <Cloud size={16} /> Connect Real Bank (Cloud Sync)
                  </button>
                </div>
              </div>

              {accounts.length === 0 ? (
                <div className="empty-state margin-top-20">
                  <Landmark size={36} className="text-muted margin-bottom-8" />
                  <h3>No Bank Accounts or Wallets Added Yet</h3>
                  <p className="margin-top-4">Link a real bank account with cloud sync or add a manual offline wallet to start tracking balances.</p>
                  <div className="flex-center gap-12 margin-top-16">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddAccountModal(true)}>
                      + Offline Cash Wallet
                    </button>
                    <button type="button" className="btn btn-primary flex-align gap-6" onClick={() => setShowConnectBankModal(true)}>
                      <Cloud size={16} /> Connect Cloud Bank
                    </button>
                  </div>
                </div>
              ) : (
                <div className="wallets-grid margin-top-20">
                  {accounts.map((acc) => (
                    <WalletCard key={acc._id} account={acc} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {currentRoute === 'settings' && (
          <div className="tab-view settings-view">
            <SettingsView onNavigate={navigate} />
          </div>
        )}

        {/* LEGAL ROUTE 1: PRIVACY POLICY */}
        {currentRoute === 'privacy' && (
          <PrivacyPolicy onNavigate={navigate} />
        )}

        {/* LEGAL ROUTE 2: TERMS AND CONDITIONS */}
        {currentRoute === 'terms' && (
          <TermsAndConditions onNavigate={navigate} />
        )}

        {/* LEGAL ROUTE 3: COOKIE POLICY */}
        {currentRoute === 'cookies' && (
          <CookiePolicy onNavigate={navigate} />
        )}

        {/* LEGAL ROUTE 4: REFUND POLICY */}
        {currentRoute === 'refund' && (
          <RefundPolicy onNavigate={navigate} />
        )}

        {/* 404 NOT FOUND */}
        {currentRoute === 'notfound' && (
          <NotFound onNavigate={navigate} />
        )}
      </main>

      {/* Floating Action Button (+ Expense) */}
      <button
        type="button"
        className="fab-button"
        onClick={() => setShowAddTxModal(true)}
        title="Add Expense"
        aria-label="Add Expense Record"
      >
        <Plus size={24} />
      </button>

      {/* AI Help Assistant Floating Widget */}
      <AIChatbot />

      {/* Enterprise Corporate Footer */}
      <Footer
        onNavigate={navigate}
        onOpenCookieSettings={() => setShowCookieSettings(true)}
      />

      {/* Cookie and Privacy Consent Banner */}
      <CookieConsentBanner
        onNavigate={navigate}
        forceOpen={showCookieSettings}
        onCloseSettings={() => setShowCookieSettings(false)}
      />

      {/* Modals */}
      <TransactionFormModal isOpen={showAddTxModal} onClose={() => setShowAddTxModal(false)} />
      <BudgetFormModal isOpen={showAddBudgetModal} onClose={() => setShowAddBudgetModal(false)} />
      <SavingsGoalFormModal isOpen={showAddGoalModal} onClose={() => setShowAddGoalModal(false)} />
      <AccountModal isOpen={showAddAccountModal} onClose={() => setShowAddAccountModal(false)} />
      <ConnectBankModal isOpen={showConnectBankModal} onClose={() => setShowConnectBankModal(false)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onNavigate={navigate}
      />

      {/* Lightbox Receipt Modal */}
      <Modal isOpen={Boolean(activeReceiptUrl)} onClose={() => setActiveReceiptUrl(null)} title="Receipt Image Preview">
        {activeReceiptUrl && (
          <div className="receipt-lightbox">
            <img src={activeReceiptUrl} alt="Receipt Full Preview" className="receipt-full-img" />
          </div>
        )}
      </Modal>

      {/* Floating Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}
