import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export default function IncomeVsExpenseChart() {
  const { totalIncome, totalExpense, currency } = useApp();

  const data = [
    {
      name: 'Current Period',
      Income: totalIncome,
      Expense: totalExpense,
    },
  ];

  return (
    <div className="panel chart-panel">
      <h2>Income vs Expenses Comparison</h2>
      <div style={{ width: '100%', height: 280, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(val) => formatCurrency(val, currency)}
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
            <Legend />
            <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
