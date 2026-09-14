import { useState } from 'react';
import { Sparkles, TrendingUp, Coffee, Zap, Moon, Sun } from 'lucide-react';
import { hapticImpactLight } from '../../utils/haptics';

const STORIES = [
  { id: 'coffee', label: 'Coffee', icon: Coffee, color: '#9d785d', text: 'You spent 15% more on caffeine this week. Take a breath!' },
  { id: 'saving', label: 'Saving', icon: Zap, color: '#10b981', text: 'Great job! You saved $240 more than last month.' },
  { id: 'trend', label: 'Trends', icon: TrendingUp, color: '#6366f1', text: 'Dining out is your #1 expense. Maybe cook tonight?' },
  { id: 'budget', label: 'Limits', icon: Sparkles, color: '#f59e0b', text: 'Only 3 days left in the month. You have $120 left for Groceries.' },
  { id: 'night', label: 'Habit', icon: Moon, color: '#8b5cf6', text: 'Late night shopping detected. 11 PM seems to be a spending peak!' },
];

export default function InsightsStories() {
  const [activeStory, setActiveStory] = useState(null);

  const handleOpen = (story) => {
    hapticImpactLight();
    setActiveStory(story);
    // Auto-close after 4 seconds
    setTimeout(() => setActiveStory(null), 4000);
  };

  return (
    <div className="insights-stories-container">
      <div className="stories-scroll">
        {STORIES.map((s) => (
          <button key={s.id} className="story-bubble-wrapper" onClick={() => handleOpen(s)}>
            <div className="story-circle" style={{ borderColor: s.color }}>
              <div className="story-icon-box" style={{ backgroundColor: s.color }}>
                <s.icon size={20} />
              </div>
            </div>
            <span className="story-label">{s.label}</span>
          </button>
        ))}
      </div>

      {activeStory && (
        <div className="story-viewer-overlay" onClick={() => setActiveStory(null)}>
          <div className="story-viewer-content" style={{ backgroundColor: activeStory.color }}>
            <div className="story-progress-bar">
              <div className="progress-fill" />
            </div>
            <div className="story-viewer-header">
              <activeStory.icon size={24} />
              <h3>{activeStory.label} Insights</h3>
            </div>
            <p className="story-viewer-text">{activeStory.text}</p>
            <div className="story-viewer-footer">Tap to dismiss</div>
          </div>
        </div>
      )}
    </div>
  );
}
