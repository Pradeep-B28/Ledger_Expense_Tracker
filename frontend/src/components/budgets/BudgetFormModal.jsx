import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrencySymbol } from '../../utils/formatters';
import Modal from '../common/Modal';

export default function BudgetFormModal({ isOpen, onClose }) {
  const { addBudget, currency } = useApp();
  const [category, setCategory] = useState('Groceries');
  const [limitAmount, setLimitAmount] = useState('');
  const [period, setPeriod] = useState('monthly');

  const currencySymbol = getCurrencySymbol(currency);
  const categories = ['Groceries', 'Dining', 'Bills & Rent', 'Transport', 'Subscriptions', 'Shopping', 'Other'];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!limitAmount) return;

    await addBudget({
      category,
      limitAmount: parseFloat(limitAmount),
      period,
    });

    setLimitAmount('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Category Budget Limit">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Monthly Spending Limit ({currencySymbol})</label>
          <div className="input-group">
            <span className="input-prefix">{currencySymbol}</span>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Period</label>
          <select
            className="form-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Budget Limit
          </button>
        </div>
      </form>
    </Modal>
  );
}
