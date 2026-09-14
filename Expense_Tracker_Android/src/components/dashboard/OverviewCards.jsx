import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp, Info } from 'lucide-react';
import Skeleton from '../common/Skeleton';

export default function OverviewCards() {
  const { totalIncome, totalExpense, netBalance, currency, loading } = useApp();

  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  if (loading) {
    return (
      <div className="overview-cards-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <Skeleton width="60%" height="14px" className="margin-bottom-12" />
            <Skeleton width="80%" height="32px" className="margin-bottom-12" />
            <Skeleton width="40%" height="12px" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overview-cards-grid">
      {/* Cash Balance */}
      <div className="stat-card primary">
        <div className="card-premium-header">
          <div>
            <span className="card-label">Net Liquidity</span>
            <div className="balance-display">
              <span className="balance-amount">{formatCurrency(netBalance, currency)}</span>
            </div>
          </div>
          <div className="stat-icon-wrapper primary">
            <Wallet size={20} />
          </div>
        </div>
        <div className="stat-footer">
          <div className="flex-align gap-4">
            <TrendingUp size={12} className="text-success" />
            <span className="text-xs font-semibold text-success">+2.4% from last week</span>
          </div>
        </div>
      </div>

      {/* Income */}
      <div className="stat-card">
        <div className="card-premium-header">
          <div>
            <span className="card-label">Total Inflow</span>
            <div className="balance-display">
              <span className="balance-amount text-success">{formatCurrency(totalIncome, currency)}</span>
            </div>
          </div>
          <div className="stat-icon-wrapper income">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="stat-footer">
          <span className="text-xs text-muted">Primary source: Paychecks</span>
        </div>
      </div>

      {/* Expenses */}
      <div className="stat-card">
        <div className="card-premium-header">
          <div>
            <span className="card-label">Monthly Outflow</span>
            <div className="balance-display">
              <span className="balance-amount text-danger">{formatCurrency(totalExpense, currency)}</span>
            </div>
          </div>
          <div className="stat-icon-wrapper expense">
            <ArrowDownRight size={20} />
          </div>
        </div>
        <div className="stat-footer">
          <span className="text-xs text-muted">Peak day: Friday</span>
        </div>
      </div>

      {/* Savings Margin */}
      <div className="stat-card">
        <div className="card-premium-header">
          <div>
            <span className="card-label">Savings Margin</span>
            <div className="balance-display">
              <span className="balance-amount text-warning">{savingsRate}%</span>
            </div>
          </div>
          <div className="stat-icon-wrapper savings">
            <PiggyBank size={20} />
          </div>
        </div>
        <div className="stat-footer">
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${Math.min(100, savingsRate)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
