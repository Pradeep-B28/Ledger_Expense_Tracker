# 💸 Ledger — Next-Gen AI-Powered Expense & Financial Management Suite

[![React 18](https://img.shields.io/badge/Frontend-React_18_|_Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_|_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_|_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Capacitor](https://img.shields.io/badge/Mobile-Android_|_Capacitor_6-119CFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Sync_Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Ledger** is a market-ready, enterprise-grade personal finance & expense tracking application built using the MERN stack, Vite, and Capacitor. Designed to run seamlessly as a web app, Progressive Web App (PWA), and native Android application ready for Google Play Store deployment.

---

## 🌟 Key Highlights & Features

### ⚡ 0ms Optimistic UI Engine
- **Instant Data Mutation**: Logging expenses, savings goals, budgets, and accounts updates local state & storage in **0ms** without waiting for network latencies, while background syncing with Express/MongoDB asynchronously.

### 📊 Real-Time Financial Analytics
- **Adjacent Interactive Dashboard**: Side-by-side live updates across 3 columns (*Add Record*, *Expenses by Category Donut*, and *Recent Live Activity*) without requiring vertical page scrolling.
- **Category Spending Progress**: Visual percentage breakdown, color dots, and progress bars.
- **Income vs Expense & Trend Analysis**: Powered by Recharts for monthly cash flow tracking.

### 🤖 Built-In AI Financial Assistant
- **Floating AI Chatbot Widget**: Interactive assistant bubble helping users set spending limits, export CSV reports, attach receipt photos, and package native Android APKs.

### 🌍 Multi-Currency & Dynamic Symbols
- Automatically updates all input fields, balance displays, and reports based on user currency selection (**USD `$`, EUR `€`, GBP `£`, INR `₹`, JPY `¥`, CAD `CA$`, AUD `A$`**).

### 🏦 Real Bank Cloud Integration & Offline Storage
- **Cloud Bank Sync**: Link real financial institutions (*Chase, Bank of America, Wells Fargo, Citi, Revolut, Monzo, HSBC, Capital One*) with 256-bit cloud encrypted sync indicators.
- **Offline Cash Wallets**: Add manual cash, credit, and savings accounts stored securely on device.

### 🔐 Security & Customization
- **Account Security**: Change password modal, 2FA toggle, Biometric Face ID / Fingerprint lock, and active session manager.
- **1-Click Google & Password Auth**: Quick registration via Google Account or Username & Password.
- **5 Appearance Themes**: Cyber Dark (Default), Crisp Light, Emerald Mint, Sunset Rose, and Midnight OLED.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide Icons, Recharts, CSS Glassmorphism |
| **Backend** | Node.js, Express.js, JWT Authentication, CORS, REST APIs |
| **Database** | MongoDB, Mongoose ORM, IndexedDB / LocalStorage fallback |
| **Mobile Native** | Capacitor 6 Android, PWA Service Worker |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (Optional for cloud database, fallback to LocalStorage offline mode)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ledger-expense-tracker.git
cd ledger-expense-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend server starts at `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend client starts at `http://localhost:5173`*

---

## 📱 Packaging for Google Play Store (Android)

Ledger is pre-configured with **Capacitor 6** (`com.ledger.expensetracker`).

```bash
cd frontend
# 1. Build Production Web Bundle
npm run build

# 2. Add Android Platform
npx cap add android

# 3. Sync Assets & Open Android Studio
npx cap sync android
npx cap open android
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/YOUR_USERNAME/ledger-expense-tracker/issues).

---

## ⭐ Show Your Support

If you find this project useful or inspiring, please give it a **⭐ Star** on GitHub and follow for more projects!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
