import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, TrendingDown, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function FinancialInsightsCard() {
  const { transactions, totalIncome, totalExpense, currency } = useApp();

  const expenseTxs = transactions.filter((t) => t.type === 'expense' || !t.type);

  // Find top spending category
  const categoryTotals = {};
  expenseTxs.forEach((tx) => {
    const cat = tx.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.amount || 0);
  });

  let topCategory = 'Groceries';
  let maxSpent = 0;
  Object.keys(categoryTotals).forEach((cat) => {
    if (categoryTotals[cat] > maxSpent) {
      maxSpent = categoryTotals[cat];
      topCategory = cat;
    }
  });

  const topCategoryPct = totalExpense > 0 ? Math.round((maxSpent / totalExpense) * 100) : 0;
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="panel insights-panel">
      <div className="panel-header">
        <div className="title-with-icon">
          <Sparkles size={20} className="icon-gold" />
          <h2>Monthly Summary & Highlights</h2>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon info">
            <Lightbulb size={20} />
          </div>
          <div className="insight-content">
            <h4>Top Category Outflow</h4>
            <p>
              Your biggest expense area this month is <strong>{topCategory}</strong> at{' '}
              <strong>{formatCurrency(maxSpent, currency)}</strong> ({topCategoryPct}% of total spending).
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon success">
            <CheckCircle2 size={20} />
          </div>
          <div className="insight-content">
            <h4>Net Savings Balance</h4>
            <p>
              {netSavings >= 0 ? (
                <>You saved <strong>{formatCurrency(netSavings, currency)}</strong> after all expenses!</>
              ) : (
                <>Outflow exceeds income by <strong>{formatCurrency(Math.abs(netSavings), currency)}</strong> this period.</>
              )}
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon accent">
            <TrendingDown size={20} />
          </div>
          <div className="insight-content">
            <h4>Recurring Subscriptions</h4>
            <p>
              You have <strong>{transactions.filter((t) => t.isRecurring).length} monthly subscriptions</strong> tracked. Keep an eye out for forgotten charges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
