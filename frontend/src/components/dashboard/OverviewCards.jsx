import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react';

export default function OverviewCards() {
  const { totalIncome, totalExpense, netBalance, currency } = useApp();

  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <div className="overview-cards-grid">
      {/* Cash Balance */}
      <div className="stat-card primary">
        <div className="stat-header">
          <span className="stat-title">Cash Balance</span>
          <div className="stat-icon-wrapper primary">
            <Wallet size={20} />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(netBalance, currency)}</div>
        <div className="stat-footer">
          <span className="stat-subtext">Total across all accounts</span>
        </div>
      </div>

      {/* Income */}
      <div className="stat-card income">
        <div className="stat-header">
          <span className="stat-title">Income Earned</span>
          <div className="stat-icon-wrapper income">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(totalIncome, currency)}</div>
        <div className="stat-footer text-success">
          <span className="badge badge-success">Paychecks & Deposits</span>
        </div>
      </div>

      {/* Expenses */}
      <div className="stat-card expense">
        <div className="stat-header">
          <span className="stat-title">Total Spent</span>
          <div className="stat-icon-wrapper expense">
            <ArrowDownRight size={20} />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(totalExpense, currency)}</div>
        <div className="stat-footer text-danger">
          <span className="badge badge-danger">Outflow Spending</span>
        </div>
      </div>

      {/* Savings Margin */}
      <div className="stat-card savings">
        <div className="stat-header">
          <span className="stat-title">Savings Buffer</span>
          <div className="stat-icon-wrapper savings">
            <PiggyBank size={20} />
          </div>
        </div>
        <div className="stat-value">{savingsRate}%</div>
        <div className="stat-footer">
          <div className="mini-progress-bar">
            <div className="mini-progress-fill" style={{ width: `${Math.min(100, savingsRate)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
