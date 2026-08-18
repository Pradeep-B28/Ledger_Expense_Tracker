import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['budget', 'limit', 'category budget', 'spending limit'],
    response: "To set a budget limit, head to the 'Budgets' tab in the top navigation bar and click '+ Add Budget Limit'. You can set monthly spending limits for Groceries, Dining, Rent, Shopping, etc., and Ledger will track your progress automatically!",
  },
  {
    keywords: ['csv', 'export', 'download', 'excel', 'sheet'],
    response: "You can export all your financial records anytime! Go to the 'Expenses' or 'Settings' page and click 'Export CSV'. A spreadsheet containing dates, merchants, categories, and amounts will download immediately.",
  },
  {
    keywords: ['offline', 'sync', 'internet', 'connection', 'mongo'],
    response: "Ledger is built with dual offline-first capability! When offline or disconnected from the server, your entries are safely stored in local device memory. Once your connection returns, data automatically syncs back with MongoDB.",
  },
  {
    keywords: ['receipt', 'photo', 'image', 'upload', 'picture'],
    response: "When adding an expense via '+ Add Expense', tap 'Attach Receipt Photo'. You can upload or snap a photo of any receipt/invoice, and view it anytime directly from your expense history table!",
  },
  {
    keywords: ['playstore', 'play store', 'apk', 'mobile app', 'capacitor', 'android'],
    response: "Ledger is fully Play Store ready! To generate an Android APK/AAB package, run `npm run cap:sync` followed by `npm run cap:open` in your terminal to build directly inside Android Studio.",
  },
  {
    keywords: ['theme', 'dark', 'light', 'color', 'mode'],
    response: "Ledger supports 5 themes: Cyber Dark, Crisp Light, Emerald Mint, Sunset Rose, and Midnight OLED! You can switch themes anytime using the theme button in the top bar or in the Settings tab.",
  },
  {
    keywords: ['goal', 'savings', 'target', 'deposit', 'vacation'],
    response: "To track savings goals, navigate to the 'Budgets' tab and look for 'Target Savings Goals'. Click 'Create Savings Goal' to set target funds for trips, tech, or rainy day reserves, and deposit money with celebratory confetti!",
  },
  {
    keywords: ['account', 'wallet', 'bank', 'cash', 'credit card'],
    response: "Manage your checking accounts, credit cards, and cash wallets in the 'Accounts' tab! You can add custom wallets with custom icons, colors, and masked account numbers.",
  },
  {
    keywords: ['slow', 'speed', 'store', 'fast', 'save'],
    response: "Data saving in Ledger is instant (0ms)! Entries are immediately saved locally on your device with optimistic UI updates and background cloud synchronization.",
  },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! 👋 I'm your Ledger AI Assistant. How can I help you manage your expenses, set budgets, or navigate the app today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickQuestions = [
    "How to set a budget limit?",
    "How to export CSV data?",
    "How does offline sync work?",
    "How to attach receipt photos?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend(textToSend) {
    const userMsg = textToSend || input;
    if (!userMsg.trim()) return;

    // Add User Message
    const newMessages = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Generate Answer
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let match = KNOWLEDGE_BASE.find((k) => k.keywords.some((kw) => lower.includes(kw)));

      let responseText = match
        ? match.response
        : "I'm here to help! You can ask me how to log expenses, set category budgets, export CSV files, manage wallets, switch app themes, or build the app for Google Play Store.";

      setMessages((prev) => [...prev, { sender: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 600);
  }

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <button className="ai-chat-fab" onClick={() => setIsOpen(true)} title="Ask Ledger AI Assistant">
        <Bot size={24} />
        <span className="ai-fab-badge" />
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="flex-align gap-10">
              <div className="ai-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3>Ledger Assistant</h3>
                <span className="ai-status-text">Online • Ready to help</span>
              </div>
            </div>
            <button className="icon-btn close-chat-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="ai-chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-wrapper bot">
                <div className="chat-bubble bot typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="ai-chat-suggestions">
            {quickQuestions.map((q, idx) => (
              <button key={idx} className="suggestion-chip" onClick={() => handleSend(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            className="ai-chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Ask anything about using Ledger..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
