import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function AccountModal({ isOpen, onClose }) {
  const { addAccount } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState('bank');
  const [balance, setBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('Landmark');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;

    await addAccount({
      name,
      type,
      balance: parseFloat(balance || 0),
      accountNumber,
      color,
      icon,
    });

    setName('');
    setBalance('');
    setAccountNumber('');
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Wallet / Account">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Account Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Chase Checking, Cash Wallet, Crypto Reserve"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Account Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="bank">Bank Account</option>
              <option value="cash">Cash Wallet</option>
              <option value="credit">Credit Card</option>
              <option value="savings">Savings Account</option>
              <option value="investment">Investment Portfolio</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Starting Balance ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Account Mask / Number (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. •••• 4821"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Card Accent Color</label>
            <input
              type="color"
              className="form-color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Icon</label>
            <select className="form-select" value={icon} onChange={(e) => setIcon(e.target.value)}>
              <option value="Landmark">Landmark / Bank</option>
              <option value="Banknote">Banknote / Cash</option>
              <option value="CreditCard">Credit Card</option>
              <option value="ShieldCheck">Shield / Reserve</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Account
          </button>
        </div>
      </form>
    </Modal>
  );
}
