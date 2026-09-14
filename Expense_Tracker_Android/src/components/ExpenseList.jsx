export const CATEGORY_COLORS = {
  Food: '#fbbf77',
  Travel: '#7dd3fc',
  Bills: '#fb7185',
  Shopping: '#a78bfa',
  Other: '#7c8493',
};

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <div className="empty-state">No expenses yet — add your first one on the left.</div>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((exp) => {
        const color = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other;
        return (
          <li className="expense-item" key={exp._id}>
            <div className="left">
              <span
                className="tag"
                style={{ background: `${color}22`, color }}
              >
                {exp.category}
              </span>
              <span className="title">{exp.title}</span>
            </div>
            <div className="right">
              <span className="amount">₹{Number(exp.amount).toLocaleString('en-IN')}</span>
              <button className="delete-btn" onClick={() => onDelete(exp._id)} aria-label="Delete expense">
                ✕
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
