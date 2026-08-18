import { useState } from 'react';
import { useApp } from './context/AppContext';
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
import AIChatbot from './components/chat/AIChatbot';

import { Plus, Cloud, Landmark } from 'lucide-react';

export default function App() {
  const { activeTab, budgets, goals, accounts, toast } = useApp();

  // Modals state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Lightbox Receipt Modal
  const [activeReceiptUrl, setActiveReceiptUrl] = useState(null);

  return (
    <div className="app-shell">
      <Header onOpenAuth={() => setShowAuthModal(true)} />
      <Navbar />

      <main className="app-main-content">
        {/* TAB 1: HOME OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="tab-view dashboard-view">
            <OverviewCards />

            {/* ADJACENT SIDE-BY-SIDE GRID (FULL-HEIGHT EQUALIZED COLUMNS) */}
            <div className="dashboard-adjacent-grid margin-top-16">
              {/* Column 1: Add New Record Form */}
              <div className="adjacent-col">
                <HomeAddExpenseBar onOpenFullModal={() => setShowAddTxModal(true)} />
              </div>

              {/* Column 2: Expense by Category Chart & Breakdown List */}
              <div className="adjacent-col">
                <CategoryDonutChart />
              </div>

              {/* Column 3: Recent Live Activity Full-Height Feed */}
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
        {activeTab === 'budgets' && (
          <div className="tab-view budgets-view">
            {/* Category Budgets Section */}
            <div className="panel">
              <div className="panel-header flex-between">
                <div>
                  <h2>Category Spending Limits</h2>
                  <span className="panel-subtitle">Set maximum expenditure thresholds per category</span>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddBudgetModal(true)}>
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
                <button className="btn btn-success" onClick={() => setShowAddGoalModal(true)}>
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
        {activeTab === 'accounts' && (
          <div className="tab-view accounts-view">
            <div className="panel">
              <div className="panel-header flex-between flex-wrap gap-12">
                <div>
                  <h2>Wallets & Bank Accounts</h2>
                  <span className="panel-subtitle">Manage checking accounts, offline cash wallets, and cloud bank accounts</span>
                </div>

                <div className="flex-align gap-10">
                  <button className="btn btn-secondary flex-align gap-6" onClick={() => setShowAddAccountModal(true)}>
                    <Plus size={16} /> Add Manual Wallet (Offline)
                  </button>
                  <button className="btn btn-primary flex-align gap-6" onClick={() => setShowConnectBankModal(true)}>
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
                    <button className="btn btn-secondary" onClick={() => setShowAddAccountModal(true)}>
                      + Offline Cash Wallet
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowConnectBankModal(true)}>
                      🌐 Connect Cloud Bank
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
        {activeTab === 'settings' && (
          <div className="tab-view settings-view">
            <SettingsView />
          </div>
        )}
      </main>

      {/* Floating Action Button (+ Expense) */}
      <button className="fab-button" onClick={() => setShowAddTxModal(true)} title="Add Expense">
        <Plus size={24} />
      </button>

      {/* AI Help Assistant Floating Widget */}
      <AIChatbot />

      {/* Modals */}
      <TransactionFormModal isOpen={showAddTxModal} onClose={() => setShowAddTxModal(false)} />
      <BudgetFormModal isOpen={showAddBudgetModal} onClose={() => setShowAddBudgetModal(false)} />
      <SavingsGoalFormModal isOpen={showAddGoalModal} onClose={() => setShowAddGoalModal(false)} />
      <AccountModal isOpen={showAddAccountModal} onClose={() => setShowAddAccountModal(false)} />
      <ConnectBankModal isOpen={showConnectBankModal} onClose={() => setShowConnectBankModal(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

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
