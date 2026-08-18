import { useApp } from '../../context/AppContext';
import { calculateFinancialPulse } from '../../utils/formatters';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FinancialHealthScore() {
  const { totalIncome, totalExpense } = useApp();
  const { status, score, message, color } = calculateFinancialPulse(totalIncome, totalExpense);

  return (
    <div className="panel health-score-panel">
      <div className="panel-header">
        <div className="title-with-icon">
          <Activity size={20} className="icon-accent" />
          <h2>Monthly Financial Pulse</h2>
        </div>
        <span className="badge" style={{ backgroundColor: `${color}20`, color, borderColor: color }}>
          {status}
        </span>
      </div>

      <div className="health-score-content">
        <div className="score-gauge">
          <svg viewBox="0 0 100 100" className="gauge-svg">
            <circle cx="50" cy="50" r="40" className="gauge-bg" />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="gauge-fill"
              style={{
                stroke: color,
                strokeDasharray: 251,
                strokeDashoffset: 251 - (251 * score) / 100,
              }}
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{score}</span>
            <span className="score-max">%</span>
          </div>
        </div>

        <div className="health-details">
          <h3>
            {score >= 70 ? (
              <span className="flex-align text-success gap-6"><ShieldCheck size={18} /> Healthy Cash Flow</span>
            ) : (
              <span className="flex-align text-warning gap-6"><AlertCircle size={18} /> Spending Watch</span>
            )}
          </h3>
          <p className="health-advice">{message}</p>
        </div>
      </div>
    </div>
  );
}
