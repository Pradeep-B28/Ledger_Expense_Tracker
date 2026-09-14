<div align="center">

# 📱 Ledger Mobile — Capacitor 6 & React Expense Tracker

### *Cross-Platform Native Android Expense Manager with 0ms Optimistic UI Engine & AI Insights*

[![Capacitor](https://img.shields.io/badge/Capacitor-6.0-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Android](https://img.shields.io/badge/Android-APK%20Ready-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-mobile-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-building-android-apk">Build APK</a>
</p>

---

</div>

> [!IMPORTANT]
> **Ledger Mobile** brings personal finance management to Android devices. Packed with an offline-first **0ms Optimistic UI state engine**, transactions are rendered instantly on-screen while seamlessly syncing with the backend in the background.

---

## ⚡ Key Features

- ⚡ **0ms Optimistic UI Engine**: Zero input latency when creating, editing, or deleting expenses.
- 🤖 **AI Budgeting Assistant**: Integrated conversational AI that analyzes spending habits and suggests savings goals.
- 📊 **Dynamic Financial Charts**: Interactive monthly spending breakdown, category distribution, and trendlines.
- 📲 **Capacitor 6 Native Integration**: Hardware haptics, dark-mode native status bar, and camera receipt scanner support.
- 🌐 **Multi-Currency Support**: Instant currency conversion with local storage persistence.

---

## 🛠️ Mobile Architecture

```
[ React 18 UI / Tailwind ] ───> [ 0ms Optimistic UI State ] ───> [ Capacitor 6 Android Bridge ]
                                              │
                                              └───> [ Async Background Cloud Sync ]
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and `npm`
- Android Studio & Android SDK (for native Android builds)

```bash
# 1. Clone the repository
git clone https://github.com/Pradeep-B28/Ledger_Expense_Tracker.git
cd expense-tracker-android

# 2. Install dependencies
npm install

# 3. Start local development web server
npm run dev
```

---

## 🤖 Building Android APK

```bash
# Build production web bundle
npm run build

# Sync web assets with native Android project
npx cap sync android

# Open project in Android Studio
npx cap open android
```

---

<div align="center">

Developed by **[Pradeep](https://github.com/Pradeep-B28)**

</div>
