const LOCAL_KEY_TRANSACTIONS = 'ledger_offline_transactions';
const LOCAL_KEY_BUDGETS = 'ledger_offline_budgets';
const LOCAL_KEY_GOALS = 'ledger_offline_goals';
const LOCAL_KEY_ACCOUNTS = 'ledger_offline_accounts';

export const INITIAL_DEMO_TRANSACTIONS = [
  { _id: 'tx-1', title: 'Tech Corp Bi-Weekly Salary', amount: 2850.00, type: 'income', category: 'Paycheck', date: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Direct deposit', accountId: 'main' },
  { _id: 'tx-2', title: "Trader Joe's Groceries", amount: 92.40, type: 'expense', category: 'Groceries', date: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Weekly groceries', accountId: 'main' },
  { _id: 'tx-3', title: 'Starbucks Iced Latte', amount: 6.45, type: 'expense', category: 'Dining', date: new Date().toISOString(), notes: 'Morning coffee', accountId: 'cash' },
  { _id: 'tx-4', title: 'Monthly Apartment Rent', amount: 1450.00, type: 'expense', category: 'Bills & Rent', date: new Date(Date.now() - 86400000 * 3).toISOString(), notes: 'Rent transfer', accountId: 'main' },
  { _id: 'tx-5', title: 'Chevron Gas Station', amount: 45.00, type: 'expense', category: 'Transport', date: new Date(Date.now() - 86400000 * 4).toISOString(), notes: 'Full tank fuel', accountId: 'card' },
  { _id: 'tx-6', title: 'Netflix 4K Subscription', amount: 19.99, type: 'expense', category: 'Subscriptions', date: new Date(Date.now() - 86400000 * 5).toISOString(), isRecurring: true, recurringFrequency: 'monthly', accountId: 'card' },
  { _id: 'tx-7', title: 'Nike Store Running Shoes', amount: 120.00, type: 'expense', category: 'Shopping', date: new Date(Date.now() - 86400000 * 6).toISOString(), notes: 'Weekend shopping', accountId: 'card' },
  { _id: 'tx-8', title: 'Freelance Design Client', amount: 650.00, type: 'income', category: 'Freelance', date: new Date(Date.now() - 86400000 * 7).toISOString(), notes: 'Brand design project', accountId: 'main' },
];

export const INITIAL_DEMO_BUDGETS = [
  { _id: 'b-1', category: 'Groceries', limitAmount: 450, period: 'monthly', color: '#10b981' },
  { _id: 'b-2', category: 'Dining', limitAmount: 250, period: 'monthly', color: '#f59e0b' },
  { _id: 'b-3', category: 'Bills & Rent', limitAmount: 1600, period: 'monthly', color: '#3b82f6' },
  { _id: 'b-4', category: 'Shopping', limitAmount: 200, period: 'monthly', color: '#ec4899' },
];

export const INITIAL_DEMO_GOALS = [
  { _id: 'g-1', name: 'Emergency Rainy Day Reserve', targetAmount: 6000, currentAmount: 4200, color: '#10b981', category: 'Safety', icon: 'ShieldCheck' },
  { _id: 'g-2', name: 'Japan Summer Vacation', targetAmount: 3200, currentAmount: 1750, color: '#ec4899', category: 'Travel', icon: 'Plane' },
  { _id: 'g-3', name: 'MacBook Pro Upgrade', targetAmount: 2200, currentAmount: 1500, color: '#3b82f6', category: 'Tech', icon: 'Laptop' },
];

// Removed fake mock accounts; users add their own manual or cloud accounts
export const INITIAL_DEMO_ACCOUNTS = [];

export function getLocalTransactions() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY_TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_TRANSACTIONS;
  } catch (err) {
    return INITIAL_DEMO_TRANSACTIONS;
  }
}

export function saveLocalTransactions(txs) {
  try {
    localStorage.setItem(LOCAL_KEY_TRANSACTIONS, JSON.stringify(txs));
  } catch (err) {}
}

export function getLocalBudgets() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY_BUDGETS);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_BUDGETS;
  } catch (err) {
    return INITIAL_DEMO_BUDGETS;
  }
}

export function saveLocalBudgets(budgets) {
  try {
    localStorage.setItem(LOCAL_KEY_BUDGETS, JSON.stringify(budgets));
  } catch (err) {}
}

export function getLocalGoals() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY_GOALS);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_GOALS;
  } catch (err) {
    return INITIAL_DEMO_GOALS;
  }
}

export function saveLocalGoals(goals) {
  try {
    localStorage.setItem(LOCAL_KEY_GOALS, JSON.stringify(goals));
  } catch (err) {}
}

export function getLocalAccounts() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY_ACCOUNTS);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_ACCOUNTS;
  } catch (err) {
    return INITIAL_DEMO_ACCOUNTS;
  }
}

export function saveLocalAccounts(accs) {
  try {
    localStorage.setItem(LOCAL_KEY_ACCOUNTS, JSON.stringify(accs));
  } catch (err) {}
}
