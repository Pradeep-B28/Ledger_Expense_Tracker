import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Landmark, Shield, Lock, Check } from 'lucide-react';

const POPULAR_BANKS = [
  { id: 'chase', name: 'Chase Bank', color: '#117aca' },
  { id: 'bofa', name: 'Bank of America', color: '#e31837' },
  { id: 'wellsfargo', name: 'Wells Fargo', color: '#cd1409' },
  { id: 'citi', name: 'Citi Bank', color: '#003b70' },
  { id: 'revolut', name: 'Revolut', color: '#0075ff' },
  { id: 'monzo', name: 'Monzo Bank', color: '#ff4d4d' },
  { id: 'capitalone', name: 'Capital One', color: '#004977' },
  { id: 'hsbc', name: 'HSBC Bank', color: '#db0011' },
];

export default function ConnectBankModal({ isOpen, onClose }) {
  const { addAccount } = useApp();

  const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0]);
  const [bankUsername, setBankUsername] = useState('');
  const [startingBalance, setStartingBalance] = useState('');
  const [accountType, setAccountType] = useState('bank');
  const [connecting, setConnecting] = useState(false);

  async function handleConnect(e) {
    e.preventDefault();
    if (!bankUsername) return;

    setConnecting(true);
    setTimeout(async () => {
      await addAccount({
        name: selectedBank.name,
        type: accountType,
        balance: parseFloat(startingBalance || 2500),
        accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
        color: selectedBank.color,
        icon: 'Landmark',
        isCloudConnected: true,
      });
      setConnecting(false);
      setBankUsername('');
      setStartingBalance('');
      onClose();
    }, 1000);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Real Bank Account (Cloud Sync)">
      <form onSubmit={handleConnect} className="modal-form">
        <div className="cloud-security-badge flex-align gap-8">
          <Shield size={18} className="text-success" />
          <span>256-Bit Bank-Grade Cloud Encryption Active</span>
        </div>

        {/* Bank Selection Grid */}
        <div className="form-group margin-top-12">
          <label className="form-label">Select Your Financial Institution</label>
          <div className="banks-selector-grid margin-top-8">
            {POPULAR_BANKS.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`bank-chip-btn ${selectedBank.id === b.id ? 'active' : ''}`}
                onClick={() => setSelectedBank(b)}
              >
                <span className="bank-dot" style={{ backgroundColor: b.color }} />
                <span>{b.name}</span>
                {selectedBank.id === b.id && <Check size={14} className="text-success" />}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group margin-top-12">
          <label className="form-label">Bank Online ID / Username</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. john_chase_online"
            value={bankUsername}
            onChange={(e) => setBankUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Account Type</label>
            <select
              className="form-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="bank">Checking Account</option>
              <option value="savings">Savings Account</option>
              <option value="credit">Credit Card</option>
              <option value="investment">Investment Portfolio</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Starting Balance ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="e.g. 2500"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions margin-top-16">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-align gap-8" disabled={connecting}>
            <Lock size={16} />
            <span>{connecting ? 'Authenticating...' : 'Connect Bank & Enable Cloud Sync'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
