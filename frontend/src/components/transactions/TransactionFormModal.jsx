import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrencySymbol } from '../../utils/formatters';
import Modal from '../common/Modal';
import { Upload, X } from 'lucide-react';

export default function TransactionFormModal({ isOpen, onClose }) {
  const { addTransaction, accounts, currency } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('main');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [receiptUrl, setReceiptUrl] = useState('');

  const currencySymbol = getCurrencySymbol(currency);

  const categories = {
    expense: ['Groceries', 'Dining', 'Bills & Rent', 'Transport', 'Subscriptions', 'Shopping', 'Other'],
    income: ['Paycheck', 'Freelance', 'Investments', 'Gift', 'Other'],
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function setQuickDate(offsetDays) {
    const d = new Date(Date.now() - offsetDays * 86400000);
    setDate(d.toISOString().split('T')[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !amount) return;

    await addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      accountId,
      notes,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : 'none',
      receiptUrl,
    });

    // Reset & Close
    setTitle('');
    setAmount('');
    setNotes('');
    setReceiptUrl('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Transaction">
      <form onSubmit={handleSubmit} className="modal-form">
        {/* Type Toggle */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="segmented-control full-width">
            <button
              type="button"
              className={`segment-btn ${type === 'expense' ? 'active danger' : ''}`}
              onClick={() => {
                setType('expense');
                setCategory('Groceries');
              }}
            >
              Expense (-)
            </button>
            <button
              type="button"
              className={`segment-btn ${type === 'income' ? 'active success' : ''}`}
              onClick={() => {
                setType('income');
                setCategory('Paycheck');
              }}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Merchant / Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Trader Joe's, Starbucks, Paycheck Deposit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Amount & Category */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Amount</label>
            <div className="input-group">
              <span className="input-prefix">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Account */}
        <div className="form-row">
          <div className="form-group flex-1">
            <div className="flex-between">
              <label className="form-label">Date</label>
              <div className="quick-date-btns flex-align gap-4">
                <button type="button" className="btn-link text-xs" onClick={() => setQuickDate(0)}>
                  Today
                </button>
                <span className="text-muted">•</span>
                <button type="button" className="btn-link text-xs" onClick={() => setQuickDate(1)}>
                  Yesterday
                </button>
              </div>
            </div>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Paid From Account</label>
            <select
              className="form-select"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {accounts.length === 0 ? (
                <option value="main">Primary Cash Wallet</option>
              ) : (
                accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Add memo or item details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Recurring Switch */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <span>Recurring monthly bill / subscription</span>
          </label>
        </div>

        {/* Receipt Attachment Upload */}
        <div className="form-group">
          <label className="form-label">Attach Receipt Photo</label>
          {receiptUrl ? (
            <div className="receipt-preview-container">
              <img src={receiptUrl} alt="Receipt preview" className="receipt-preview-img" />
              <button
                type="button"
                className="btn-icon remove-receipt-btn"
                onClick={() => setReceiptUrl('')}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="upload-dropzone">
              <Upload size={22} className="upload-icon" />
              <span>Tap to attach receipt image</span>
              <input
                type="file"
                accept="image/*"
                className="file-input-hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
