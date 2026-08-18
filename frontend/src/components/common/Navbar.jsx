import { useApp } from '../../context/AppContext';
import { Home, CreditCard, PieChart, Target, Wallet, Settings } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Expenses', icon: CreditCard },
    { id: 'analytics', label: 'Insights', icon: PieChart },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="app-navbar">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="nav-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
