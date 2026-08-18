import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrencySymbol } from '../../utils/formatters';
import { PlusCircle, Plus, FileText } from 'lucide-react';

export default function HomeAddExpenseBar({ onOpenFullModal }) {
  const { addTransaction, currency } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Groceries');

  const categories = {
    expense: ['Groceries', 'Dining', 'Bills & Rent', 'Transport', 'Subscriptions', 'Shopping', 'Other'],
    income: ['Paycheck', 'Freelance', 'Investments', 'Gift', 'Other'],
  };

  const currencySymbol = getCurrencySymbol(currency);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
  }

  return (
    <div className="panel home-add-expense-panel flex-column-full">
      <div className="panel-header flex-between">
        <div className="title-with-icon">
          <PlusCircle size={18} className="icon-accent" />
          <h2 className="text-base">Add New Record</h2>
        </div>
        <button type="button" className="btn-link text-xs flex-align gap-4" onClick={onOpenFullModal}>
          <FileText size={12} /> Full Form
        </button>
      </div>

      <form className="home-add-form-structured flex-1 flex-column flex-between" onSubmit={handleSubmit}>
        {/* Step 1: Type Selector Tabs */}
        <div className="segmented-control type-pills full-width">
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

        {/* Step 2: Description / Merchant Input */}
        <div className="form-group margin-top-10">
          <label className="form-label text-xs">Description / Merchant</label>
          <input
            type="text"
            className="form-input"
            placeholder={type === 'expense' ? 'e.g. Trader Joe\'s, Coffee, Gas' : 'e.g. Paycheck, Freelance Deposit'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Step 3: Amount & Category Row */}
        <div className="form-row margin-top-10">
          <div className="form-group flex-1">
            <label className="form-label text-xs">Amount ({currencySymbol})</label>
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
            <label className="form-label text-xs">Category</label>
            <select
              className="form-select full-width"
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

        {/* Step 4: Submit Action */}
        <button type="submit" className="btn btn-primary full-width margin-top-12">
          <Plus size={16} />
          <span>Save Record</span>
        </button>
      </form>
    </div>
  );
}
