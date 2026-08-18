import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { Search, Download, Plus, Trash2, Image, Filter, Repeat, Utensils, Car, FileText, ShoppingBag, Briefcase, ShoppingCart, Tv, DollarSign, X } from 'lucide-react';

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
            Showing {filteredTransactions.length} of {transactions.length} total entries
          </span>
        </div>

        <div className="flex-align gap-8">
          <button className="btn btn-secondary" onClick={() => exportToCSV(filteredTransactions)}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search merchants, notes, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          {/* Type Filter Segment */}
          <div className="segmented-control">
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

          {/* Category Selector */}
          <div className="select-wrapper">
            <Filter size={14} className="select-icon" />
            <select
              className="form-select filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Data */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>No matching transactions found. Try clearing filters or adding a new record.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Merchant / Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes / Receipt</th>
                <th>Amount</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const Icon = CATEGORY_ICONS[tx.category] || FileText;
                const isIncome = tx.type === 'income';

                return (
                  <tr key={tx._id}>
                    <td>
                      <div className="tx-cell-title">
                        <div className={`category-icon-wrapper sm ${isIncome ? 'income' : (tx.category || 'other').toLowerCase().replace(/[^a-z]/g, '')}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="tx-title-text">
                            {tx.title}
                            {tx.isRecurring && <Repeat size={12} className="recurring-icon" title="Recurring Entry" />}
                          </div>
                          <span className="account-tag">{tx.accountId === 'main' ? 'Checking' : tx.accountId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{tx.category}</span>
                    </td>
                    <td className="text-muted">{formatDate(tx.date || tx.createdAt)}</td>
                    <td className="text-muted notes-cell">
                      {tx.notes || '—'}
                      {tx.receiptUrl && (
                        <button
                          className="btn-link text-accent flex-align gap-4 margin-left-8"
                          onClick={() => onViewReceipt(tx.receiptUrl)}
                        >
                          <Image size={12} /> Receipt
                        </button>
                      )}
                    </td>
                    <td className={`font-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="text-right">
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => deleteTransaction(tx._id)}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
