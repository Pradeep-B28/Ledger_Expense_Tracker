import { useApp } from '../../context/AppContext';
import { calculateFinancialPulse } from '../../utils/formatters';
import { Activity, ShieldCheck, AlertCircle, BarChart, ExternalLink, ArrowRight } from 'lucide-react';
import { hapticImpactLight } from '../../utils/haptics';

export default function FinancialHealthScore() {
  const { totalIncome, totalExpense, showToast } = useApp();
  const { status, score, message, color } = calculateFinancialPulse(totalIncome, totalExpense);

  const handleAuditClick = () => {
    hapticImpactLight();
    showToast('Full Audit Report is being generated...', 'info');
  };

  return (
    <div className="panel health-score-panel premium-audit-card">
      <div className="panel-header flex-between">
        <div className="title-with-icon">
          <Activity size={20} className="text-primary" />
          <h2 className="text-base">Financial Integrity Score</h2>
        </div>
        <div className="status-badge-premium" style={{ borderColor: color, color }}>
          {status}
        </div>
      </div>

      <div className="health-score-content">
        <div className="score-gauge-container">
          <div className="score-gauge">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="45" className="gauge-bg" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="gauge-fill"
                style={{
                  stroke: color,
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (283 * score) / 100,
                }}
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
        </div>

        <div className="health-details">
          <div className="audit-label">AUTOMATED AUDIT RESULT</div>
          <h3 className="margin-bottom-4">
            {score >= 70 ? (
              <span className="flex-align text-success gap-6"><ShieldCheck size={18} /> High Integrity</span>
            ) : (
              <span className="flex-align text-warning gap-6"><AlertCircle size={18} /> Optimization Needed</span>
            )}
          </h3>
          <p className="health-advice text-sm">{message}</p>

          <button className="btn-audit-link margin-top-12" onClick={handleAuditClick}>
            <span>View Full Audit Details</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="audit-footer-stats margin-top-20">
        <div className="audit-stat-item">
          <span className="stat-label">Liquidity Ratio</span>
          <span className="stat-val">{(totalIncome / (totalExpense || 1)).toFixed(2)}x</span>
        </div>
        <div className="audit-stat-item">
          <span className="stat-label">Stability Index</span>
          <span className="stat-val">Moderate</span>
        </div>
        <div className="audit-stat-item">
          <span className="stat-label">Risk Level</span>
          <span className="stat-val text-success">Low</span>
        </div>
      </div>
    </div>
  );
}
