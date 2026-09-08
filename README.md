# Indeed Auto-Apply Job Board

This repository contains the completed submission for the Jobnova (Liba Space) Full Stack Software Engineer (AI Application) challenge. It features an interactive, mobile-responsive (H5) recommendation dashboard paired with a Playwright-based browser automation pipeline for Indeed applications.

---

## 📂 Project Architecture

The repository is organized as a monorepo pairing a headless browser automation worker with an interactive Vite SPA:

```text
indeed-auto-apply-job-board/
├── apply.js                  # Playwright automation queue processor
├── login.js                  # One-time authenticated session generator
├── package.json              # Root dependencies & automation scripts
├── playwright/
│   └── .auth/
│       └── auth.json         # Persisted storageState (session cookies/local storage)
└── client/                   # Vite + React Frontend SPA
    ├── public/
    │   └── applications.json # Central JSON datastore (synced with automation worker)
    ├── src/
    │   ├── App.tsx           # Master-detail recommendation dashboard & polling logic
    │   └── index.css         # Tailwind CSS styling
    ├── package.json          # Client dependencies
    └── vite.config.ts        # Vite configuration
```

---

## 🏗 System Design & Tech Stack

### Frontend (Dashboard & Recommendation Hub)
* **Framework:** React 18 + Vite (TypeScript)
* **Styling:** Tailwind CSS (utility-first, responsive H5 adaptation for mobile screens)
* **Architecture:** Master-Detail inspector featuring category filter tabs, full-text role search, bookmarking, and match score metrics.
* **Live Synchronization:** The UI reads from `public/applications.json` via continuous polling and manual state synchronization to reflect real-time automation state transitions (`pending` → `in_progress` → `manual_action_required` → `submitted`).

### Backend (Browser Automation & Worker)
* **Engine:** Playwright (Node.js)
* **Session Persistence:** Uses Playwright's `storageState` API (`playwright/.auth/auth.json`) to persist authentication tokens and cookies, bypassing repeated login steps.
* **Human-in-the-Loop Safeguards:** Implements terminal-driven interactive pauses via Node.js `readline`. If multi-factor authentication, security challenges, or complex screening questionnaires occur, the script flags `manual_action_required`, alerts the user, and resumes once verified.
* **State Persistence:** Directly reads and writes application lifecycle status into the shared JSON datastore.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Install Dependencies

Install root backend dependencies and Playwright browsers:
```bash
npm install
npx playwright install chromium
```

Install frontend client dependencies:
```bash
cd client
npm install
cd ..
```

### 2. Run the Application

#### Step A: Launch the Frontend Dashboard
Open a terminal in the `client` directory and start the Vite development server:
```bash
cd client
npm run dev
```
Navigate to the local URL provided (typically `http://localhost:5173` or `http://localhost:5177`) to view the interactive recommendation board.

#### Step B: Establish Session (First Time Only)
To capture a persistent authenticated session without triggering anti-bot protections:
```bash
node login.js
```
Complete login in the visible Chromium window. The session will automatically save to `playwright/.auth/auth.json`.

#### Step C: Run Application Queue
In your root terminal, execute the automation worker:
```bash
node apply.js
```
Watch the console output and browser execution. The React dashboard will update its status badges and queue statistics dynamically as applications progress.
