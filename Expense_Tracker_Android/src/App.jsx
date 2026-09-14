import { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import Modal from './components/common/Modal';

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
import InsightsStories from './components/dashboard/InsightsStories';
import { hapticImpactMedium } from './utils/haptics';

import { Plus, Cloud, Landmark, Wifi, Battery, Signal, Target, PiggyBank, Wallet, LayoutDashboard, Receipt, BarChart3, Settings } from 'lucide-react';

export default function App() {
  console.log('Ledger: App Component Rendering');
  const { activeTab, budgets, goals, accounts, toast } = useApp();
  const { user, loading: authLoading } = useAuth();

  // Onboarding / Splash state
  const [showSplash, setShowSplash] = useState(true);

  // Modals state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sub-tab for Budgets & Accounts section
  const [budgetSubTab, setBudgetSubTab] = useState('limits'); // 'limits' | 'goals' | 'wallets'

  // Lightbox Receipt Modal
  const [activeReceiptUrl, setActiveReceiptUrl] = useState(null);

  // Dynamic status bar time state
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    // Hide splash after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // 1. Splash Screen View
  if (showSplash) {
    return (
      <div className="mobile-app-wrapper">
        <div className="mobile-phone-frame splash-screen-frame">
          <div className="splash-content">
            <div className="splash-logo">💳</div>
            <h1 className="splash-title">Ledger</h1>
            <div className="splash-loader"></div>
            <p className="text-xs text-muted margin-top-20 opacity-60">Initializing Secure Workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Auth Gate: If not logged in, show Auth Screen
  if (!user && !authLoading) {
    return (
      <div className="mobile-app-wrapper">
        <div className="mobile-phone-frame auth-screen-frame">
          <AuthModal isOpen={true} onClose={() => {}} isFullScreen={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-app-wrapper">
      {/* Outer Mobile Phone Frame */}
      <div className="mobile-phone-frame">
        {/* Simulated Mobile Status Bar (Visible on desktop/tablet views) */}
        <div className="simulated-status-bar">
          <span className="status-bar-time">{currentTime}</span>
          <div className="status-bar-notch" />
          <div className="status-bar-icons">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Mobile Header Bar */}
        <Header onOpenAuth={() => setShowAuthModal(true)} />

        {/* Scrollable Mobile Screen Body */}
        <main className="mobile-screen-body">
          {/* TAB 1: HOME OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="tab-view dashboard-view">
              <InsightsStories />

              <div className="pull-refresh-hint">
                <span className="text-xs text-muted">Pull down to synchronize</span>
              </div>

              <OverviewCards />

              <div className="margin-top-14">
                <FinancialHealthScore />
              </div>

              <div className="margin-top-14">
                <HomeAddExpenseBar onOpenFullModal={() => setShowAddTxModal(true)} />
              </div>

              <div className="margin-top-14">
                <div className="panel compact">
                  <div className="flex-between margin-bottom-12">
                    <h3 className="text-sm font-semibold">Priority Alerts</h3>
                    <span className="text-xs text-primary font-bold">2 New</span>
                  </div>
                  <div className="flex-column gap-8">
                    <div className="flex-align gap-10 p-8 bg-input border-radius-sm">
                      <Zap size={14} className="text-warning" />
                      <span className="text-xs">Budget limit for 'Dining' reached 85%</span>
                    </div>
                    <div className="flex-align gap-10 p-8 bg-input border-radius-sm">
                      <Target size={14} className="text-success" />
                      <span className="text-xs">Savings Goal 'New Car' is 60% complete!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="margin-top-14">
                <RecentActivity onViewReceipt={(url) => setActiveReceiptUrl(url)} />
              </div>
            </div>
          )}

          {/* TAB 2: EXPENSES */}
          {activeTab === 'transactions' && (
            <div className="tab-view transactions-view">
              <TransactionList
                onOpenAddModal={() => setShowAddTxModal(true)}
                onViewReceipt={(url) => setActiveReceiptUrl(url)}
              />
            </div>
          )}

          {/* TAB 3: INSIGHTS */}
          {activeTab === 'analytics' && (
            <div className="tab-view analytics-view">
              <FinancialInsightsCard />

              <div className="margin-top-14">
                <CategoryDonutChart />
              </div>

              <div className="margin-top-14">
                <IncomeVsExpenseChart />
              </div>

              <div className="margin-top-14">
                <SpendingTrendChart />
              </div>
            </div>
          )}

          {/* TAB 4: BUDGETS & SAVINGS & WALLETS */}
          {activeTab === 'budgets' && (
            <div className="tab-view budgets-view">
              {/* Segmented Control for Sub-sections */}
              <div className="segmented-control subtab-control full-width margin-bottom-14">
                <button
                  className={`segment-btn ${budgetSubTab === 'limits' ? 'active' : ''}`}
                  onClick={() => setBudgetSubTab('limits')}
                >
                  <Target size={14} /> Limits
                </button>
                <button
                  className={`segment-btn ${budgetSubTab === 'goals' ? 'active' : ''}`}
                  onClick={() => setBudgetSubTab('goals')}
                >
                  <PiggyBank size={14} /> Goals
                </button>
                <button
                  className={`segment-btn ${budgetSubTab === 'wallets' ? 'active' : ''}`}
                  onClick={() => setBudgetSubTab('wallets')}
                >
                  <Wallet size={14} /> Wallets
                </button>
              </div>

              {/* Sub-tab 1: Spending Limits */}
              {budgetSubTab === 'limits' && (
                <div className="panel">
                  <div className="panel-header flex-between flex-wrap gap-8">
                    <div>
                      <h2>Category Limits</h2>
                      <span className="panel-subtitle">Spending thresholds</span>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddBudgetModal(true)}>
                      <Plus size={14} /> Add Limit
                    </button>
                  </div>

                  {budgets.length === 0 ? (
                    <div className="empty-state margin-top-16">
                      <p>No spending limits set yet. Tap above to add one.</p>
                    </div>
                  ) : (
                    <div className="budgets-grid margin-top-14">
                      {budgets.map((b) => (
                        <BudgetCard key={b._id} budget={b} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Savings Goals */}
              {budgetSubTab === 'goals' && (
                <div className="panel">
                  <div className="panel-header flex-between flex-wrap gap-8">
                    <div>
                      <h2>Savings Goals</h2>
                      <span className="panel-subtitle">Track target funds</span>
                    </div>
                    <button className="btn btn-success btn-sm" onClick={() => setShowAddGoalModal(true)}>
                      <Plus size={14} /> New Goal
                    </button>
                  </div>

                  {goals.length === 0 ? (
                    <div className="empty-state margin-top-16">
                      <p>No savings goals created. Start saving towards a target!</p>
                    </div>
                  ) : (
                    <div className="goals-grid margin-top-14">
                      {goals.map((g) => (
                        <SavingsGoalCard key={g._id} goal={g} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 3: Wallets & Bank Accounts */}
              {budgetSubTab === 'wallets' && (
                <div className="panel">
                  <div className="panel-header flex-between flex-wrap gap-8">
                    <div>
                      <h2>Wallets & Banks</h2>
                      <span className="panel-subtitle">Balances & linked accounts</span>
                    </div>
                    <div className="flex-align gap-6">
                      <button className="btn btn-secondary btn-sm" onClick={() => setShowAddAccountModal(true)}>
                        <Plus size={14} /> Wallet
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowConnectBankModal(true)}>
                        <Cloud size={14} /> Link Bank
                      </button>
                    </div>
                  </div>

                  {accounts.length === 0 ? (
                    <div className="empty-state margin-top-16">
                      <Landmark size={32} className="text-muted margin-bottom-8" />
                      <h3>No Accounts Added</h3>
                      <p className="margin-top-4 text-xs">Add an offline cash wallet or link a cloud bank account.</p>
                    </div>
                  ) : (
                    <div className="wallets-grid margin-top-14">
                      {accounts.map((acc) => (
                        <WalletCard key={acc._id} account={acc} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="tab-view settings-view">
              <SettingsView />
            </div>
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <Navbar onOpenAddModal={() => setShowAddTxModal(true)} />

        {/* AI Help Assistant Widget */}
        <AIChatbot />

        {/* Modals & Bottom Sheets */}
        <TransactionFormModal isOpen={showAddTxModal} onClose={() => setShowAddTxModal(false)} />
        <BudgetFormModal isOpen={showAddBudgetModal} onClose={() => setShowAddBudgetModal(false)} />
        <SavingsGoalFormModal isOpen={showAddGoalModal} onClose={() => setShowAddGoalModal(false)} />
        <AccountModal isOpen={showAddAccountModal} onClose={() => setShowAddAccountModal(false)} />
        <ConnectBankModal isOpen={showConnectBankModal} onClose={() => setShowConnectBankModal(false)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {/* Lightbox Receipt Modal */}
        <Modal isOpen={Boolean(activeReceiptUrl)} onClose={() => setActiveReceiptUrl(null)} title="Receipt Preview">
          {activeReceiptUrl && (
            <div className="receipt-lightbox">
              <img src={activeReceiptUrl} alt="Receipt Preview" className="receipt-full-img" />
            </div>
          )}
        </Modal>

        {/* Toast Notification */}
        <Toast toast={toast} />
      </div>
    </div>
  );
}

