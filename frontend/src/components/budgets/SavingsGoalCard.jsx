import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import Modal from '../common/Modal';
import { Trash2, Plus, Trophy, Target, ShieldCheck, Plane, Laptop } from 'lucide-react';

const GOAL_ICONS = {
  ShieldCheck,
  Plane,
  Laptop,
  Target,
};

export default function SavingsGoalCard({ goal }) {
  const { depositToGoal, deleteGoal, currency } = useApp();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const current = Number(goal.currentAmount) || 0;
  const target = Number(goal.targetAmount) || 1;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isCompleted = current >= target;

  const Icon = GOAL_ICONS[goal.icon] || Target;

  async function handleDeposit(e) {
    e.preventDefault();
    if (!depositAmount) return;

    await depositToGoal(goal._id, parseFloat(depositAmount));
    
    // Trigger confetti celebration!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setDepositAmount('');
    setShowDepositModal(false);
  }

  return (
    <>
      <div className={`goal-card ${isCompleted ? 'completed' : ''}`}>
        <div className="goal-header flex-between">
          <div className="flex-align gap-10">
            <div className="goal-icon-badge" style={{ backgroundColor: `${goal.color || '#10b981'}20`, color: goal.color || '#10b981' }}>
              <Icon size={20} />
            </div>
            <div>
              <h3>{goal.name}</h3>
              <span className="category-tag">{goal.category || 'General'}</span>
            </div>
          </div>

          <div className="flex-align gap-6">
            {isCompleted && (
              <span className="badge badge-success flex-align gap-4">
                <Trophy size={14} /> Completed
              </span>
            )}
            <button className="icon-btn delete-btn" onClick={() => deleteGoal(goal._id)}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="goal-amounts flex-between">
          <div>
            <span className="amount-label">Saved</span>
            <div className="amount-value text-success">{formatCurrency(current, currency)}</div>
          </div>
          <div className="text-right">
            <span className="amount-label">Target</span>
            <div className="amount-value">{formatCurrency(target, currency)}</div>
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill success"
            style={{ width: `${percentage}%`, backgroundColor: goal.color || '#10b981' }}
          />
        </div>

        <div className="goal-footer flex-between">
          <span className="pct-text">{percentage}% Achieved</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowDepositModal(true)}>
            <Plus size={14} /> Deposit Funds
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} title={`Deposit to ${goal.name}`}>
        <form onSubmit={handleDeposit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Deposit Amount</label>
            <div className="input-group">
              <span className="input-prefix">$</span>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="e.g. 100.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowDepositModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Add Deposit 🎉
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
