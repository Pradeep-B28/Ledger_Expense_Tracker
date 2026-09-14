import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function SpendingTrendChart() {
  const { transactions, currency } = useApp();

  // Group by date
  const dateMap = {};
  [...transactions].reverse().forEach((tx) => {
    const d = formatDate(tx.date || tx.createdAt);
    if (!dateMap[d]) dateMap[d] = 0;
    if (tx.type === 'expense' || !tx.type) {
      dateMap[d] += Number(tx.amount || 0);
    }
  });

  const data = Object.keys(dateMap).map((d) => ({
    date: d,
    amount: dateMap[d],
  }));

  if (data.length === 0) {
    return (
      <div className="panel chart-panel">
        <h2>Daily Spending Trend</h2>
        <div className="empty-state">
          <p>No transaction history to display timeline.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel chart-panel">
      <h2>Daily Spending Trend</h2>
      <div style={{ width: '100%', height: 260, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.4} />
            <XAxis dataKey="date" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(val) => formatCurrency(val, currency)}
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
