import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Zap } from 'lucide-react';

export default function QuickAddBar({ onOpenModal }) {
  const { addTransaction } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');

  const categories = ['Groceries', 'Dining', 'Bills & Rent', 'Transport', 'Shopping', 'Other'];

  const quickPresets = [
    { title: 'Morning Coffee', amount: '6.45', category: 'Dining' },
    { title: 'Lunch Meal', amount: '14.50', category: 'Dining' },
    { title: 'Gas Fill Up', amount: '45.00', category: 'Transport' },
    { title: 'Grocery Run', amount: '65.00', category: 'Groceries' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !amount) return;

    await addTransaction({
      title,
      amount: parseFloat(amount),
      category,
      type: 'expense',
      date: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
  }

  function handlePreset(preset) {
    addTransaction({
      title: preset.title,
      amount: parseFloat(preset.amount),
      category: preset.category,
      type: 'expense',
      date: new Date().toISOString(),
    });
  }

  return (
    <div className="panel quick-add-panel">
      <div className="panel-header flex-between">
        <div className="title-with-icon">
          <Zap size={20} className="icon-lightning" />
          <h2>Quick Entry</h2>
        </div>
        <button className="btn btn-sm btn-secondary" onClick={onOpenModal}>
          + Full Entry
        </button>
      </div>

      {/* Quick 1-Tap Preset Chips */}
      <div className="preset-chips flex-align gap-8 margin-bottom-12">
        <span className="preset-label">Quick 1-Tap:</span>
        {quickPresets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="chip-btn"
            onClick={() => handlePreset(p)}
          >
            {p.title} (${p.amount})
          </button>
        ))}
      </div>

      <form className="quick-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Merchant or item name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="input-group">
          <span className="input-prefix">$</span>
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

        <button type="submit" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
