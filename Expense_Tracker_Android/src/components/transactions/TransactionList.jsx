import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Search,
  Download,
  Plus,
  Trash2,
  Image,
  Filter,
  Repeat,
  Utensils,
  Car,
  FileText,
  ShoppingBag,
  Briefcase,
  ShoppingCart,
  Tv,
  DollarSign,
  X,
  CreditCard,
} from 'lucide-react';

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

export default function TransactionList({ onOpenAddModal, onViewReceipt }) {
  const { transactions, deleteTransaction, currency } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Groceries', 'Dining', 'Bills & Rent', 'Transport', 'Subscriptions', 'Shopping', 'Paycheck', 'Freelance', 'Other'];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      (tx.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.notes || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.category || '').toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'All' || tx.type === typeFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="panel transactions-page-panel">
      {/* Header Controls */}
      <div className="panel-header flex-between flex-wrap gap-12">
        <div>
          <h2>Expense Ledger</h2>
          <span className="panel-subtitle">
            {filteredTransactions.length} of {transactions.length} entries
          </span>
        </div>

        <div className="flex-align gap-8">
          <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(filteredTransactions)}>
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type Selector Segment */}
        <div className="segmented-control full-width margin-top-10">
          {['All', 'Expense', 'Income'].map((type) => (
            <button
              key={type}
              className={`segment-btn ${typeFilter === type ? 'active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Scrollable Category Filter Chips */}
        <div className="category-chips-slider margin-top-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state margin-top-20">
          <CreditCard size={36} className="text-muted margin-bottom-8" />
          <p>No matching transactions found.</p>
        </div>
      ) : (
        <div className="mobile-tx-list margin-top-16">
          {filteredTransactions.map((tx) => {
            const Icon = CATEGORY_ICONS[tx.category] || FileText;
            const isIncome = tx.type === 'income';

            return (
              <div key={tx._id} className="mobile-tx-card">
                <div className={`category-icon-wrapper ${isIncome ? 'income' : (tx.category || 'other').toLowerCase().replace(/[^a-z]/g, '')}`}>
                  <Icon size={18} />
                </div>

                <div className="mobile-tx-info">
                  <div className="mobile-tx-header">
                    <span className="mobile-tx-title">{tx.title}</span>
                    {tx.isRecurring && <Repeat size={12} className="recurring-badge" title="Monthly Recurring" />}
                  </div>

                  <div className="mobile-tx-meta">
                    <span className="badge badge-neutral text-xs">{tx.category || 'Other'}</span>
                    <span className="meta-dot">•</span>
                    <span className="text-xs text-muted">{formatDate(tx.date || tx.createdAt)}</span>
                  </div>

                  {tx.notes && <p className="mobile-tx-notes">{tx.notes}</p>}

                  {tx.receiptUrl && (
                    <button
                      className="receipt-chip sm margin-top-4"
                      onClick={() => onViewReceipt(tx.receiptUrl)}
                    >
                      <Image size={11} /> Receipt Attached
                    </button>
                  )}
                </div>

                <div className="mobile-tx-right">
                  <div className={`mobile-tx-amount ${isIncome ? 'text-success' : 'text-danger'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </div>
                  <button
                    className="icon-btn delete-btn sm margin-top-6"
                    onClick={() => deleteTransaction(tx._id)}
                    title="Remove entry"
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

