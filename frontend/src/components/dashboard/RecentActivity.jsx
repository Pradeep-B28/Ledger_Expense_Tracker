import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShoppingBag, Utensils, Car, FileText, Briefcase, Trash2, Image, Repeat, ShoppingCart, Tv, DollarSign, Activity } from 'lucide-react';

const CATEGORY_ICONS = {
  Groceries: ShoppingCart,
  Dining: Utensils,
  'Bills & Rent': FileText,
  Transport: Car,
  Subscriptions: Tv,
  Shopping: ShoppingBag,
  Paycheck: DollarSign,
  Freelance: Briefcase,
  Other: FileText,
};

export default function RecentActivity({ onViewReceipt }) {
  const { transactions, deleteTransaction, currency, setActiveTab } = useApp();

  const recent = transactions.slice(0, 10);

  return (
    <div className="panel recent-activity-panel flex-column-full">
      <div className="panel-header flex-between">
        <div className="title-with-icon">
          <Activity size={18} className="icon-accent" />
          <h2 className="text-base">Recent Live Activity</h2>
        </div>
        <button className="btn-link text-xs" onClick={() => setActiveTab('transactions')}>
          View All ({transactions.length})
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state flex-1 flex-center">
          <p>No activity recorded yet. Add your first transaction!</p>
        </div>
      ) : (
        <div className="activity-list full-height flex-1">
          {recent.map((tx) => {
            const Icon = CATEGORY_ICONS[tx.category] || FileText;
            const isIncome = tx.type === 'income';

            return (
              <div key={tx._id} className="activity-item compact">
                <div className={`category-icon-wrapper sm ${isIncome ? 'income' : (tx.category || 'other').toLowerCase().replace(/[^a-z]/g, '')}`}>
                  <Icon size={14} />
                </div>

                <div className="activity-info">
                  <div className="activity-title text-sm">
                    <span className="truncate">{tx.title}</span>
                    {tx.isRecurring && <Repeat size={12} className="recurring-badge" title="Monthly Recurring" />}
                    {tx.receiptUrl && (
                      <button
                        className="receipt-chip sm"
                        onClick={() => onViewReceipt(tx.receiptUrl)}
                        title="View Receipt Image"
                      >
                        <Image size={10} />
                      </button>
                    )}
                  </div>
                  <div className="activity-meta text-xs">
                    <span className="category-tag">{tx.category}</span> • <span>{formatDate(tx.date || tx.createdAt)}</span>
                  </div>
                </div>

                <div className="activity-right">
                  <div className={`activity-amount text-sm ${isIncome ? 'text-success' : 'text-danger'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </div>
                  <button
                    className="icon-btn delete-btn sm"
                    onClick={() => deleteTransaction(tx._id)}
                    title="Remove Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
