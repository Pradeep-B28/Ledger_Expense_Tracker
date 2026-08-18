import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BudgetCard({ budget }) {
  const { transactions, deleteBudget, currency } = useApp();

  const categoryTxs = transactions.filter(
    (t) => t.category === budget.category && (t.type === 'expense' || !t.type)
  );

  const spent = categoryTxs.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const limit = Number(budget.limitAmount) || 1;
  const percentage = Math.min(100, Math.round((spent / limit) * 100));
  const remaining = Math.max(0, limit - spent);
  const isOver = spent > limit;

  const getStatusColor = () => {
    if (isOver) return '#ef4444';
    if (percentage > 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <div>
          <h3>{budget.category} Budget</h3>
          <span className="budget-period">{budget.period || 'Monthly'} Limit</span>
        </div>
        <button
          className="icon-btn delete-btn"
          onClick={() => deleteBudget(budget._id)}
          title="Delete Budget"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="budget-amounts flex-between">
        <div>
          <span className="amount-label">Spent</span>
          <div className="amount-value" style={{ color: getStatusColor() }}>
            {formatCurrency(spent, currency)}
          </div>
        </div>
        <div className="text-right">
          <span className="amount-label">Limit</span>
          <div className="amount-value">{formatCurrency(limit, currency)}</div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatusColor(),
          }}
        />
      </div>

      <div className="budget-card-footer flex-between">
        <span className="pct-text">{percentage}% Used</span>
        {isOver ? (
          <span className="status-text danger flex-align gap-4">
            <AlertTriangle size={14} /> Over limit by {formatCurrency(spent - limit, currency)}
          </span>
        ) : (
          <span className="status-text success flex-align gap-4">
            <CheckCircle size={14} /> {formatCurrency(remaining, currency)} remaining
          </span>
        )}
      </div>
    </div>
  );
}
