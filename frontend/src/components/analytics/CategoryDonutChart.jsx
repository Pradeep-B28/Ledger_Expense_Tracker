import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#6366f1', '#64748b'];

export default function CategoryDonutChart({ compact }) {
  const { transactions, currency } = useApp();

  const expenseTxs = transactions.filter((t) => t.type === 'expense' || !t.type);

  const categoryTotals = {};
  let totalExpenseAmount = 0;

  expenseTxs.forEach((tx) => {
    const cat = tx.category || 'Other';
    const amount = Number(tx.amount || 0);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    totalExpenseAmount += amount;
  });

  const data = Object.keys(categoryTotals)
    .map((cat) => ({
      name: cat,
      value: categoryTotals[cat],
      percentage: totalExpenseAmount > 0 ? Math.round((categoryTotals[cat] / totalExpenseAmount) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="panel chart-panel flex-column-full">
        <div className="panel-header flex-between">
          <div className="title-with-icon">
            <PieIcon size={18} className="icon-accent" />
            <h2 className="text-base">Expenses by Category</h2>
          </div>
        </div>
        <div className="empty-state flex-1 flex-center">
          <p>No expense entries logged yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel chart-panel flex-column-full">
      <div className="panel-header flex-between">
        <div className="title-with-icon">
          <PieIcon size={18} className="icon-accent" />
          <h2 className="text-base">Expenses by Category</h2>
        </div>
        <span className="badge badge-neutral">Total: {formatCurrency(totalExpenseAmount, currency)}</span>
      </div>

      <div className="chart-and-legend-container flex-1 flex-column">
        {/* Recharts Donut */}
        <div className="donut-wrapper">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => formatCurrency(val, currency)}
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Progress List (Fills Space Perfectly) */}
        <div className="category-breakdown-list margin-top-12">
          {data.map((item, index) => (
            <div key={item.name} className="breakdown-item">
              <div className="breakdown-header flex-between text-xs">
                <span className="flex-align gap-6">
                  <span className="color-dot-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-semibold text-main">{item.name}</span>
                </span>
                <span className="text-muted">
                  {formatCurrency(item.value, currency)} ({item.percentage}%)
                </span>
              </div>
              <div className="mini-progress-bar margin-top-4">
                <div
                  className="mini-progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
