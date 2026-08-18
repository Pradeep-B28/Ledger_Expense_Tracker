import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from './ExpenseList.jsx';

export default function CategoryChart({ expenses }) {
  const totals = {};
  expenses.forEach((exp) => {
    totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount);
  });

  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <div className="empty-state">Chart fills in as you add expenses.</div>;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#171a21',
              border: '1px solid #262b36',
              borderRadius: 8,
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: '#e8eaed',
            }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {data.map((entry) => (
          <div className="legend-item" key={entry.name}>
            <span
              className="legend-dot"
              style={{ background: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </>
  );
}
