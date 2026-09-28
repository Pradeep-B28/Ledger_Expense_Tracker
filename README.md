<div align="center">

# 💸 Ledger Fullstack — Enterprise Personal Finance & Analytics Platform

### *Production-Ready Personal Finance Ecosystem powered by Node.js, Express, MongoDB, React & Android (Capacitor)*

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Android Capacitor](https://img.shields.io/badge/Mobile-Android%20Capacitor-1192E8?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  A cross-platform financial tracking powerhouse designed for personal and small-business budgeting.<br />
  Includes secure JWT session management, categorized expense tracking, dynamic analytics visualization, budget sliding-window optimizations, and a native Android mobile build.
</p>

</div>

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Web Dashboard](#2-frontend-web-dashboard)
  - [Android Mobile Build](#3-android-mobile-build)
- [Algorithmic Budgeting](#-algorithmic-budgeting)
- [License & Copyright](#-license--copyright)

---

## 💡 Overview

**Ledger Fullstack** unites cloud financial accounting with cross-platform accessibility. Built on a modular MERN architecture with native Capacitor integration, it delivers real-time transaction ledgering, category spending breakdowns, and predictive budget caps whether viewed on a desktop browser or an Android smartphone.

---

## 🌟 Key Features

- 🔐 **Robust Authentication & Security**: Stateless JWT token authentication with bcrypt password hashing and route guard middleware.
- 📊 **Dynamic Financial Visualizations**: Interactive expense-to-income distribution donuts, monthly trend lines, and cashflow charts.
- 🏷️ **Granular Categorization**: Custom color-coded expense categories with metadata icons and transaction filtering.
- 📱 **Mobile Native Parity**: Pre-configured Capacitor Android bridge for building native `.apk` packages.
- 🧮 **Algorithmic Budget Optimization**: Built-in sliding window optimization for calculating maximum expenditure durations within budget thresholds.

---

## 🏗️ System Architecture

```
                                +-----------------------------+
                                |      CLIENT INTERFACES      |
                                +--------------+--------------+
                                               |
                     +-------------------------+-------------------------+
                     |                                                   |
          +----------v----------+                             +----------v----------+
          |  React Web App      |                             | Android Mobile App  |
          |  (Vite + Tailwind)  |                             | (Capacitor Runtime) |
          +----------+----------+                             +----------+----------+
                     |                                                   |
                     +-------------------------+-------------------------+
                                               |
                                               v HTTP REST / JSON
                                +-----------------------------+
                                |     EXPRESS REST API        |
                                | - JWT Auth & Verification   |
                                | - Transaction Controllers   |
                                | - Spending Aggregations     |
                                +--------------+--------------+
                                               |
                                               v Mongoose ODM
                                +-----------------------------+
                                |      MONGODB DATABASE       |
                                | Users, Categories, Expenses |
                                +-----------------------------+
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile & preferences | Yes (Bearer Token) |
| `GET` | `/api/expenses` | List all expenses with pagination & filters | Yes (Bearer Token) |
| `POST` | `/api/expenses` | Record a new expense or income item | Yes (Bearer Token) |
| `PUT` | `/api/expenses/:id` | Update an existing transaction | Yes (Bearer Token) |
| `DELETE`| `/api/expenses/:id` | Delete an expense entry | Yes (Bearer Token) |
| `GET` | `/api/analytics/summary`| Aggregate spending totals by category | Yes (Bearer Token) |

---

## 📁 Project Directory Structure

```text
Ledger_Expense_Tracker/
├── backend/                           # Node.js / Express REST API Server
│   ├── middleware/                    # JWT auth and request validation
│   ├── models/                        # Mongoose schemas (User, Expense, Category)
│   ├── routes/                        # Express API route definitions
│   ├── utils/                         # Helper functions & data formatters
│   ├── server.js                      # Express application entry point
│   ├── package.json                   # Backend dependencies
│   └── .env.example                   # Environment configuration template
├── frontend/                          # React + Vite Web Client
│   ├── src/                           # React UI components, contexts & styles
│   ├── public/                        # Static assets & icons
│   ├── capacitor.config.json          # Capacitor mobile bridge configuration
│   ├── package.json                   # Web dependencies
│   └── vite.config.js                 # Vite bundler configuration
├── Expense_Tracker_Android/           # Dedicated Capacitor Android Mobile Project
│   ├── android/                       # Native Android Studio project & Gradle files
│   ├── build-apk.bat                  # Automated Windows batch script for APK builds
│   ├── capacitor.config.json          # Android-specific Capacitor settings
│   └── package.json                   # Mobile package configuration
├── SlidingWindow.java                 # Algorithmic budget window computation utility
├── LICENSE                            # MIT License with copyright
└── README.md                          # Comprehensive documentation
```

---

## ⚡ Getting Started

### 1. Backend Setup

```powershell
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env to set:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/expense_tracker
# JWT_SECRET=your_super_secret_jwt_key

# Start the server
npm start
```
The server will run at `http://localhost:5000`.

### 2. Frontend Web Dashboard

```powershell
cd ..\frontend
npm install
npm run dev
```
Open `http://localhost:5173` to access the interactive web console.

### 3. Android Mobile Build

```powershell
cd ..\Expense_Tracker_Android
npm install
npm run build
npx cap sync android
```
To generate a release or debug APK, execute the bundled batch file:
```cmd
build-apk.bat
```

---

## 🧮 Algorithmic Budgeting

The repository includes [`SlidingWindow.java`](SlidingWindow.java), an efficient $\mathcal{O}(N)$ two-pointer algorithm that determines the longest consecutive period of expenses that stays within a user's defined discretionary budget:

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

## 📄 License & Copyright

```
Copyright (c) 2026 Pradeep Basha (Pradeep-B28). All Rights Reserved.

Licensed under the MIT License. You may freely use, modify, and distribute
this project under the terms of the MIT license. See the LICENSE file for details.
```

Built with 💳 by **[Pradeep Basha](https://github.com/Pradeep-B28)**.
