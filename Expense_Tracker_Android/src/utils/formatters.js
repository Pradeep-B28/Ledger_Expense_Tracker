export const CURRENCY_MAP = {
  USD: { symbol: '$', label: 'USD ($)', code: 'USD' },
  EUR: { symbol: '€', label: 'EUR (€)', code: 'EUR' },
  GBP: { symbol: '£', label: 'GBP (£)', code: 'GBP' },
  INR: { symbol: '₹', label: 'INR (₹)', code: 'INR' },
  JPY: { symbol: '¥', label: 'JPY (¥)', code: 'JPY' },
  CAD: { symbol: 'CA$', label: 'CAD ($)', code: 'CAD' },
  AUD: { symbol: 'A$', label: 'AUD ($)', code: 'AUD' },
};

export function getCurrencySymbol(currencyCode = 'USD') {
  const info = CURRENCY_MAP[currencyCode] || CURRENCY_MAP.USD;
  return info.symbol;
}

export function formatCurrency(amount, currencyCode = 'USD') {
  const numericAmount = Number(amount) || 0;
  const currencyInfo = CURRENCY_MAP[currencyCode] || CURRENCY_MAP.USD;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyInfo.code,
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (err) {
    return `${currencyInfo.symbol}${numericAmount.toFixed(2)}`;
  }
}

export function formatDate(dateString) {
  if (!dateString) return 'Today';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Today';

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays === 0 && now.getDate() === date.getDate()) {
    return 'Today';
  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateFinancialPulse(income, expenses) {
  const safeIncome = Number(income) || 0;
  const safeExpenses = Number(expenses) || 0;
  const net = safeIncome - safeExpenses;
  const savingsRate = safeIncome > 0 ? Math.max(0, Math.round((net / safeIncome) * 100)) : 0;

  if (safeIncome <= 0 && safeExpenses <= 0) {
    return { status: 'Good', score: 100, message: 'All clear! Ready to log your income & expenses.', color: '#10b981' };
  }

  if (savingsRate >= 30) {
    return { status: 'Great Shape', score: 92, message: `Awesome job! You're saving ${savingsRate}% of your income.`, color: '#10b981' };
  } else if (savingsRate >= 15) {
    return { status: 'On Track', score: 75, message: `Solid month! You've saved ${savingsRate}% of what you earned.`, color: '#3b82f6' };
  } else if (savingsRate > 0) {
    return { status: 'Tight Margin', score: 55, message: `You're breaking even with a ${savingsRate}% savings buffer.`, color: '#f59e0b' };
  } else {
    return { status: 'Over Budget', score: 35, message: `Spending is higher than income by ${formatCurrency(Math.abs(net))}.`, color: '#ef4444' };
  }
}
