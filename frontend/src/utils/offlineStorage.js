const LOCAL_KEY_TRANSACTIONS = 'ledger_offline_transactions';
const LOCAL_KEY_BUDGETS = 'ledger_offline_budgets';
const LOCAL_KEY_GOALS = 'ledger_offline_goals';
const LOCAL_KEY_ACCOUNTS = 'ledger_offline_accounts';

// Clean slate: no fake or placeholder test data
export const INITIAL_DEMO_TRANSACTIONS = [];
export const INITIAL_DEMO_BUDGETS = [];
export const INITIAL_DEMO_GOALS = [];
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
