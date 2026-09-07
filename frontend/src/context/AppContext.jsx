import { createContext, useContext, useEffect, useState } from 'react';
import {
  getLocalTransactions,
  saveLocalTransactions,
  getLocalBudgets,
  saveLocalBudgets,
  getLocalGoals,
  saveLocalGoals,
  getLocalAccounts,
  saveLocalAccounts,
} from '../utils/offlineStorage';

const AppContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState(() => localStorage.getItem('ledger_currency') || 'USD');
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState(() => getLocalTransactions());
  const [budgets, setBudgets] = useState(() => getLocalBudgets());
  const [goals, setGoals] = useState(() => getLocalGoals());
  const [accounts, setAccounts] = useState(() => getLocalAccounts());

  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    localStorage.setItem('ledger_currency', currency);
  }, [currency]);

  function getAuthHeaders() {
    const token = localStorage.getItem('ledger_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Fast background data sync with backend
  async function refreshData() {
    try {
      const healthRes = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
      if (healthRes && healthRes.ok) {
        setConnected(true);
        const headers = getAuthHeaders();
        // Sync in background without blocking UI
        Promise.all([
          fetch(`${API_BASE}/expenses`, { headers }),
          fetch(`${API_BASE}/budgets`, { headers }),
          fetch(`${API_BASE}/goals`, { headers }),
          fetch(`${API_BASE}/accounts`, { headers }),
        ]).then(async ([txRes, bRes, gRes, aRes]) => {
          if (txRes && txRes.ok) {
            const txData = await txRes.json();
            if (txData.length > 0) {
              setTransactions(txData);
              saveLocalTransactions(txData);
            }
          }
          if (bRes && bRes.ok) {
            const bData = await bRes.json();
            if (bData.length > 0) {
              setBudgets(bData);
              saveLocalBudgets(bData);
            }
          }
          if (gRes && gRes.ok) {
            const gData = await gRes.json();
            if (gData.length > 0) {
              setGoals(gData);
              saveLocalGoals(gData);
            }
          }
          if (aRes && aRes.ok) {
            const aData = await aRes.json();
            if (aData.length > 0) {
              setAccounts(aData);
              saveLocalAccounts(aData);
            }
          }
        }).catch(() => {});
      } else {
        setConnected(false);
      }
    } catch (err) {
      setConnected(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  // --- Optimistic Transaction Actions (0ms Instant Feedback) ---
  function addTransaction(tx) {
    const newTx = {
      ...tx,
      _id: tx._id || `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Instant local update
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveLocalTransactions(updated);
    showToast(`${tx.type === 'income' ? 'Income' : 'Expense'} added!`);

    // 2. Background API sync
    if (connected) {
      fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tx),
      }).catch(() => {});
    }
    return newTx;
  }

  function deleteTransaction(id) {
    // 1. Instant local removal
    const updated = transactions.filter((t) => t._id !== id);
    setTransactions(updated);
    saveLocalTransactions(updated);
    showToast('Transaction removed', 'info');

    // 2. Background API sync
    if (connected) {
      fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).catch(() => {});
    }
  }

  // --- Optimistic Budget Actions ---
  function addBudget(budget) {
    const newBudget = {
      ...budget,
      _id: `b-${Date.now()}`,
    };

    const updated = [...budgets, newBudget];
    setBudgets(updated);
    saveLocalBudgets(updated);
    showToast(`Budget limit set for ${budget.category}`);

    if (connected) {
      fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(budget),
      }).catch(() => {});
    }
  }

  function deleteBudget(id) {
    const updated = budgets.filter((b) => b._id !== id);
    setBudgets(updated);
    saveLocalBudgets(updated);
    showToast('Budget deleted', 'info');

    if (connected) {
      fetch(`${API_BASE}/budgets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).catch(() => {});
    }
  }

  // --- Optimistic Savings Goal Actions ---
  function addGoal(goal) {
    const newGoal = {
      ...goal,
      _id: `g-${Date.now()}`,
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveLocalGoals(updated);
    showToast(`Goal '${goal.name}' created!`);

    if (connected) {
      fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(goal),
      }).catch(() => {});
    }
  }

  function depositToGoal(id, depositAmount) {
    const updatedGoals = goals.map((g) => {
      if (g._id === id) {
        const newCurr = Number(g.currentAmount || 0) + Number(depositAmount);
        return {
          ...g,
          currentAmount: newCurr,
          isCompleted: newCurr >= g.targetAmount,
        };
      }
      return g;
    });

    setGoals(updatedGoals);
    saveLocalGoals(updatedGoals);
    showToast(`Deposited $${depositAmount} towards goal! 🎉`);

    if (connected) {
      fetch(`${API_BASE}/goals/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ depositAmount }),
      }).catch(() => {});
    }
  }

  function deleteGoal(id) {
    const updated = goals.filter((g) => g._id !== id);
    setGoals(updated);
    saveLocalGoals(updated);
    showToast('Goal removed', 'info');

    if (connected) {
      fetch(`${API_BASE}/goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).catch(() => {});
    }
  }

  // --- Optimistic Account Actions ---
  function addAccount(acc) {
    const newAcc = {
      ...acc,
      _id: `acc-${Date.now()}`,
    };

    const updated = [...accounts, newAcc];
    setAccounts(updated);
    saveLocalAccounts(updated);
    showToast(`Account '${acc.name}' added`);

    if (connected) {
      fetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(acc),
      }).catch(() => {});
    }
  }

  // Aggregates
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' || !t.type)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        connected,
        loading,
        transactions,
        budgets,
        goals,
        accounts,
        totalIncome,
        totalExpense,
        netBalance,
        toast,
        showToast,
        refreshData,
        addTransaction,
        deleteTransaction,
        addBudget,
        deleteBudget,
        addGoal,
        depositToGoal,
        deleteGoal,
        addAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
