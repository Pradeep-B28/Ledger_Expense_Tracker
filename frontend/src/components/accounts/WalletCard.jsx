import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Landmark, Banknote, CreditCard, ShieldCheck, Wallet, Cloud } from 'lucide-react';

const ACCOUNT_ICONS = {
  Landmark,
  Banknote,
  CreditCard,
  ShieldCheck,
  Wallet,
};

export default function WalletCard({ account }) {
  const { currency } = useApp();
  const Icon = ACCOUNT_ICONS[account.icon] || Wallet;
  const isCredit = account.type === 'credit';

  return (
    <div className="wallet-card" style={{ borderColor: `${account.color || '#3b82f6'}40` }}>
      <div className="wallet-card-header flex-between">
        <div className="flex-align gap-10">
          <div className="wallet-icon-box" style={{ backgroundColor: account.color || '#3b82f6' }}>
            <Icon size={20} color="#fff" />
          </div>
          <div>
            <h3>{account.name}</h3>
            <div className="flex-align gap-6 margin-top-2">
              <span className="account-number">{account.accountNumber || '•••• Active Wallet'}</span>
              {account.isCloudConnected && (
                <span className="cloud-badge flex-align gap-4" title="Cloud Encrypted Sync Active">
                  <Cloud size={12} /> Sync On
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="badge badge-neutral uppercase">{account.type}</span>
      </div>

      <div className="wallet-card-body margin-top-12">
        <span className="balance-label">Current Balance</span>
        <div className={`wallet-balance ${isCredit && account.balance < 0 ? 'text-warning' : 'text-main'}`}>
          {formatCurrency(account.balance, currency)}
        </div>
      </div>
    </div>
  );
}
