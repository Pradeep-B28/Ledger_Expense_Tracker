import { useApp } from '../../context/AppContext';
import { Home, CreditCard, Plus, PieChart, Target, Settings } from 'lucide-react';
import { hapticImpactLight, hapticImpactMedium } from '../../utils/haptics';

export default function Navbar({ onOpenAddModal }) {
  const { activeTab, setActiveTab } = useApp();

  const handleTabClick = (id) => {
    hapticImpactLight();
    setActiveTab(id);
  };

  const handleFabClick = () => {
    hapticImpactMedium();
    onOpenAddModal();
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Expenses', icon: CreditCard },
    { id: 'add-action', isAction: true },
    { id: 'analytics', label: 'Insights', icon: PieChart },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-container">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key="center-fab-action"
                className="mobile-nav-fab-btn"
                onClick={handleFabClick}
                title="Add Expense"
              >
                <Plus size={22} />
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <div className="nav-icon-container">
                <Icon size={20} className="nav-icon" />
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="nav-active-pill" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

