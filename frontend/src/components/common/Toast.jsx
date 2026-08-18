import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="toast-icon success" size={20} />,
    error: <AlertCircle className="toast-icon error" size={20} />,
    info: <Info className="toast-icon info" size={20} />,
  };

  return (
    <div className={`toast-notification ${toast.type || 'success'}`}>
      {icons[toast.type] || icons.success}
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
