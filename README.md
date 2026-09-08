<div align="center">

# 💸 Ledger Fullstack — MERN Personal Finance & Analytics Platform

### *Production-Ready Personal Finance Dashboard powered by Node.js, Express, MongoDB & React*

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

</div>

> [!TIP]
> **Ledger Fullstack** provides a complete end-to-end cloud financial tracking solution. It features secure API endpoints, JWT authentication, real-time analytics aggregation, and a sleek glassmorphism user interface.

---

## 🌟 Key Features

- 🔐 **Secure JWT Authentication**: User sign-up, sign-in, session management, and encrypted password hashing.
- 📈 **Real-Time Analytics & Reporting**: Monthly cash flow charts, category breakdown, and income vs. expense ratios.
- 🏷️ **Custom Expense Categories**: Create and color-code custom transaction categories with custom icons.
- ⚡ **Optimistic Client State**: Responsive UI updates with background REST API synchronization.

---

## 📂 Project Architecture

```
expense-tracker-demo/
├── backend/                           # Node.js / Express REST API Server
│   ├── config/                        # Database Connection (MongoDB / In-Memory DB)
│   ├── controllers/                   # Transaction & Auth Controllers
│   ├── models/                        # Mongoose Schemas (User, Expense, Category)
│   ├── routes/                        # API Endpoint Handlers (/api/expenses, /api/auth)
│   └── server.js                      # Express Entry Point
└── frontend/                          # React / Vite / Tailwind Web Dashboard
    ├── src/
    │   ├── components/                # Analytics Charts, Modals, Navbar, Expense Lists
    │   ├── context/                   # Global Auth & Expense State Providers
    │   └── services/                  # Axios REST API Client
    └── index.html
```

---

## 🚀 Quick Start

### 1. Launch Backend API Server
```bash
cd backend
npm install
npm start
# Server starts at http://localhost:5000
```

### 2. Launch Frontend Client Dashboard
```bash
cd frontend
npm install
npm run dev
# Dashboard launches at http://localhost:5173
```

---

<div align="center">

Crafted by **[Pradeep](https://github.com/Pradeep-B28)**

</div>
