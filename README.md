# Ledger - Enterprise Personal Finance & Analytics Platform

Production-ready, privacy-first personal finance platform powered by Node.js, Express, MongoDB, React, and Capacitor for Android.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Compliance](https://img.shields.io/badge/Compliance-DPDP%20Act%202023%20%7C%20GDPR-blue?style=flat)](/privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

A cross-platform financial tracking ecosystem engineered for personal and small-business budgeting. Features zero-third-party tracking, strict tenant data isolation, DPDP Act 2023 compliance, offline-first local caching, and native Android packaging.

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Security & Compliance Hardening](#security--compliance-hardening)
- [System Architecture](#system-architecture)
- [API Endpoints Reference](#api-endpoints-reference)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Web Dashboard](#2-frontend-web-dashboard)
  - [Android Mobile Build](#3-android-mobile-build)
- [Algorithmic Budgeting](#algorithmic-budgeting)
- [Legal & Regulatory Notice](#legal--regulatory-notice)
- [License & Copyright](#license--copyright)

---

## Overview

**Ledger** unites cloud financial accounting with cross-platform accessibility. Built on a modular MERN architecture with native Capacitor integration, it delivers real-time transaction ledgering, category spending thresholds, and predictive budget caps across desktop browsers and Android smartphones.

---

## Key Features

- **Privacy-First Architecture**: Zero third-party advertising trackers, no telemetry beacons, and complete data minimization.
- **Strict Tenant Isolation**: All database queries, updates, and deletions enforce `{ userId: req.user.id }` scoping, preventing cross-account data leaks.
- **Dynamic Financial Visualizations**: Interactive expense-to-income distribution donuts, monthly trend lines, and cashflow charts.
- **Offline-First Zero Latency**: Transactions cache immediately to HTML5 LocalStorage with background cloud synchronization.
- **Mobile Native Parity**: Pre-configured Capacitor Android bridge for compiling native `.apk` packages.
- **Data Subject Sovereignty**: One-click machine-readable JSON data export and irreversible account erasure under the DPDP Act 2023.

---

## Security & Compliance Hardening

Ledger is built to withstand production audits and regulatory scrutiny:

1. **Digital Personal Data Protection Act 2023 (India) & GDPR Compliance**:
   - Explicit informed consent collected during user registration.
   - Appointed Grievance Redressal Officer / Data Protection Officer (DPO).
   - Dedicated Right to Data Portability (`GET /api/auth/export-data`) and Right to Erasure (`DELETE /api/auth/erase-account`).
   - Granular Cookie Consent Banner with zero tracking cookies.
2. **Transport & Server Hardening**:
   - HTTP Strict Transport Security (HSTS) and automatic HTTPS redirection in production.
   - Content Security Policy (CSP) headers applied via Helmet.
   - Strict API rate limiting (300 requests / 15 minutes overall; 20 requests / 15 minutes for authentication).
   - JSON body payload capping at 5MB to mitigate denial-of-service vectors.
3. **Database & Authorization Hardening**:
   - Passwords cryptographically salted using `bcryptjs` (salt factor 10).
   - Every mutation checks authenticated ownership (`findOneAndUpdate({ _id, userId })` and `findOneAndDelete({ _id, userId })`).
   - Internal stack traces and server errors masked in production responses.

---

## System Architecture

```
                                +-----------------------------+
                                |      CLIENT INTERFACES      |
                                +--------------+--------------+
                                               |
                     +-------------------------+-------------------------+
                     |                                                   |
          +----------v----------+                             +----------v----------+
          |  React Web App      |                             | Android Mobile App  |
          |  (Vite + Lucide)    |                             | (Capacitor Runtime) |
          +----------+----------+                             +----------+----------+
                     |                                                   |
                     +-------------------------+-------------------------+
                                               |
                                               v HTTPS REST / JSON
                                +-----------------------------+
                                |     EXPRESS REST API        |
                                | - Helmet Security Headers   |
                                | - API Rate Limiters         |
                                | - Scoped Tenant Auth (JWT)  |
                                | - DPDP Act Compliance Gate  |
                                +--------------+--------------+
                                               |
                                               v Mongoose ODM
                                +-----------------------------+
                                |      MONGODB DATABASE       |
                                | Users, Accounts, Budgets,   |
                                | Transactions, Savings Goals |
                                +-----------------------------+
```

---

## API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register user account with DPDP consent | No |
| `POST` | `/api/auth/login` | Authenticate user and receive scoped JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile and preferences | Yes (Bearer Token) |
| `GET` | `/api/auth/export-data` | Export full personal data archive (DPDP Act) | Yes (Bearer Token) |
| `DELETE`| `/api/auth/erase-account`| Permanently delete account and all records | Yes (Bearer Token) |
| `GET` | `/api/expenses` | List user transactions with filters | Yes (Bearer Token) |
| `POST` | `/api/expenses` | Record a new expense or income item | Yes (Bearer Token) |
| `PUT` | `/api/expenses/:id` | Update transaction owned by user | Yes (Bearer Token) |
| `DELETE`| `/api/expenses/:id` | Delete transaction owned by user | Yes (Bearer Token) |
| `GET` | `/api/budgets` | List user category budget limits | Yes (Bearer Token) |
| `POST` | `/api/budgets` | Create category budget limit | Yes (Bearer Token) |
| `PUT` | `/api/budgets/:id` | Update budget limit owned by user | Yes (Bearer Token) |
| `DELETE`| `/api/budgets/:id` | Delete budget limit owned by user | Yes (Bearer Token) |
| `GET` | `/api/goals` | List user savings targets | Yes (Bearer Token) |
| `POST` | `/api/goals` | Create savings goal target | Yes (Bearer Token) |
| `PUT` | `/api/goals/:id` | Update goal or deposit funds | Yes (Bearer Token) |
| `DELETE`| `/api/goals/:id` | Delete goal owned by user | Yes (Bearer Token) |
| `GET` | `/api/accounts` | List user checking, card, and cash wallets | Yes (Bearer Token) |
| `POST` | `/api/accounts` | Add manual wallet or bank account | Yes (Bearer Token) |
| `PUT` | `/api/accounts/:id` | Update account details owned by user | Yes (Bearer Token) |
| `DELETE`| `/api/accounts/:id` | Delete account owned by user | Yes (Bearer Token) |
| `GET` | `/api/health` | Health check endpoint | No |

---

## Project Directory Structure

```text
Ledger_Expense_Tracker/
├── backend/                           # Node.js / Express REST API Server
│   ├── middleware/                    # JWT auth, role validation & tenant scoping
│   ├── models/                        # Mongoose models (User, Transaction, Budget, Goal, Account)
│   ├── routes/                        # Express API route handlers
│   ├── utils/                         # Helper functions & JWT formatters
│   ├── server.js                      # Express application entry point
│   ├── package.json                   # Backend dependencies
│   └── .env.example                   # Environment configuration template
├── frontend/                          # React + Vite Web Client
│   ├── public/                        # Static assets (robots.txt, sitemap.xml, llms.txt, og-image.svg)
│   ├── src/
│   │   ├── components/                # Modular UI components
│   │   │   ├── accounts/              # Wallets and bank accounts
│   │   │   ├── analytics/             # Charts and insight panels
│   │   │   ├── auth/                  # Authentication modal with DPDP consent
│   │   │   ├── budgets/               # Budget cards and savings goals
│   │   │   ├── chat/                  # AI support assistant
│   │   │   ├── common/                # Header, Navbar, Footer, Breadcrumbs, 404
│   │   │   ├── dashboard/             # Overview cards, pulse score, recent activity
│   │   │   ├── legal/                 # Privacy Policy, Terms, Cookies, Refund, Consent Banner
│   │   │   ├── settings/              # Settings & DPDP rights management
│   │   │   └── transactions/          # Transaction table & modal
│   │   ├── context/                   # React Context (AuthContext, AppContext, ThemeContext)
│   │   ├── utils/                     # Offline storage, formatters, CSV export
│   │   ├── App.jsx                    # Root component with HTML5 History API routing
│   │   ├── index.css                  # De-vibe-coded WCAG AA responsive stylesheet
│   │   └── main.jsx                   # React DOM mounting
│   ├── vite.config.js                 # Vite production build configuration
│   └── package.json                   # Frontend dependencies
├── android/                           # Capacitor Android Studio Native Project
└── README.md                          # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- MongoDB (local or Atlas cluster)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Web Dashboard

```bash
cd frontend
npm install
npm run dev
```

To create a production build with vendor chunk splitting and no source maps:
```bash
npm run build
```

### 3. Android Mobile Build

```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

---

## Algorithmic Budgeting

Ledger includes algorithmic sliding window calculations for determining maximum sustained expenditure durations within budget thresholds:

```java
public class SlidingWindow {
    public static int longest(int arr[], int budget) {
        int start = 0, sum = 0, max = 0;
        for (int end = 0; end < arr.length; end++) {
            sum += arr[end];
            while (sum > budget) {
                sum -= arr[start++];
            }
            max = Math.max(max, end - start + 1);
        }
        return max;
    }
}
```

---

## Legal & Regulatory Notice

Ledger is a personal budgeting and expense tracking computation utility. It does NOT provide certified financial planning, investment advice, tax accounting, or legal counsel. All calculations, alerts, and summaries are derived from user-submitted numbers.

**Data Fiduciary:** Ledger Technologies  
**Data Protection & Grievance Officer:** Pradeep Basha  
**Email:** grievance@ledger.app | privacy@ledger.app  
**Address:** Indiranagar, Bangalore, Karnataka 560038, India  

---

## License & Copyright

```
Copyright (c) 2026 Ledger Technologies / Pradeep Basha. All Rights Reserved.

Licensed under the MIT License. You may freely use, modify, and distribute
this project under the terms of the MIT license. See the LICENSE file for details.
```

Maintained by **[Pradeep Basha](https://github.com/Pradeep-B28)**.
