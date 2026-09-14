import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function SavingsGoalFormModal({ isOpen, onClose }) {
  const { addGoal } = useApp();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('Safety');
  const [icon, setIcon] = useState('ShieldCheck');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !targetAmount) return;

    await addGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      category,
      icon,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Savings Target Goal">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Goal Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Emergency Fund, Japan Trip, New Car"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Target Amount ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="e.g. 5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Initial Balance ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Category Tag</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Safety, Travel, Gadgets"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Icon</label>
            <select className="form-select" value={icon} onChange={(e) => setIcon(e.target.value)}>
              <option value="ShieldCheck">Shield / Reserve</option>
              <option value="Plane">Travel / Airplane</option>
              <option value="Laptop">Tech / Device</option>
              <option value="Target">Bullseye / General Target</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Savings Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}
