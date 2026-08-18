export function exportToCSV(transactions, filename = 'ledger_transactions.csv') {
  if (!transactions || !transactions.length) return;

  const headers = ['ID', 'Date', 'Type', 'Title', 'Category', 'Amount', 'Account', 'Notes', 'Is Recurring'];
  const rows = transactions.map((t) => [
    t._id || '',
    new Date(t.date || t.createdAt).toLocaleDateString(),
    t.type || 'expense',
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.category || 'Other',
    t.amount || 0,
    t.accountId || 'main',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    t.isRecurring ? 'Yes' : 'No',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
