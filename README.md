# Jobnova Take-Home Challenge

This repository contains both the frontend UI and the backend automation module for the Jobnova AI agent take-home challenge.

## Video Demo

[Link](https://youtu.be/xQRzc87-KF8?si=KKLve2YBUqKFuaiv)

The demo showcases the complete end-to-end workflow of the application:

- Starting the frontend and API bridge.
- Viewing the job listings and application statuses.
- Triggering **Auto Apply** from the frontend.
- The Express API invoking the Playwright automation.
- Playwright restoring the saved Indeed session using `storageState`.
- The automation navigating through the application flow and updating job statuses in real time.

**Note:** For the demo video, I cropped out the second and third jobs because both applications automatically progressed to the final "Review your application" page. Since every required field was autofilled, they followed the exact same workflow as the first job. The automation intentionally pauses at the final review step to allow users to manually verify their application before submission, so continuing those jobs would have shown the same behavior.

## Overall Architecture

The project is structured as a monorepo consisting of three main parts:
1. **Frontend (`/client`)**: A React/Vite application styled with Tailwind CSS and animated with Framer Motion. It acts as the user-facing job board.
2. **Backend Automation (`/indeed-automation-test`)**: A Node.js module utilizing Playwright to securely manage browser sessions and execute automated interactions on Indeed.com.
3. **API Bridge (`server.js`)**: A lightweight Express.js server in the root directory that connects the frontend to the backend. When a user clicks "Auto Apply" on the frontend, the bridge triggers the Playwright script.

The primary database for this MVP is a shared local file: `client/public/applications.json`. The frontend polls this file to display job details and statuses, while the backend script reads from and writes to it to update the status of ongoing applications.

## How to Run

1. **Install Root Dependencies** (Express bridge):
   ```bash
   npm install
   ```
2. **Install Frontend Dependencies**:
   ```bash
   cd client && npm install && cd ..
   ```
3. **Install Backend Dependencies**:
   ```bash
   cd indeed-automation-test && npm install && npx playwright install chromium && cd ..
   ```

**To start the full stack (Frontend + API Bridge):**
Run `npm run dev` from the root directory. This will start the React app on `http://localhost:5173` and the API bridge on `http://localhost:3001`.

## Backend Architecture Details

### Session Storage and Restoration
To satisfy the requirement of securely saving and restoring the Indeed login session without keeping the browser running continuously, the backend uses Playwright's `storageState` feature.
- The `login.js` script allows the user to manually log in and complete any initial 2FA/CAPTCHA. Once logged in, it saves the cookies and local storage tokens to `playwright/.auth/auth.json`.
- The `apply.js` script subsequently initializes new browser contexts using this `auth.json` file. This securely injects the authenticated session into the headless browser, allowing it to bypass the login screen entirely on subsequent runs.

### Handling Manual Verification and Failures
The automation script is designed with a "human-in-the-loop" philosophy to ensure compliance with Indeed's security mechanisms.
- **Failures:** If a job link is broken or the initial "Apply" button cannot be found within the timeout period, the script catches the error, marks the job status as `failed` in the JSON file, and cleanly proceeds to the next job in the queue.
- **Manual Verification:** The script navigates through standard application forms automatically (by looking for 'Continue' or 'Next' buttons). However, if it encounters an unfamiliar dynamic question, a CAPTCHA, or reaches the final "Review your application" step, it pauses execution and prompts the user via the terminal (`process.stdin`). The user can manually review the application in the open browser window, solve any challenges, and then press ENTER in the terminal to resume or finalize the automation flow. If left incomplete, the job is marked as `manual_action_required`.

### Extending the Solution for Multiple Users
While this is a minimal MVP for a single user, the architecture can be extended for multi-tenant production use:
1. **Database:** Replace the `applications.json` file with a robust relational database (e.g., PostgreSQL). Tables would include `Users`, `Jobs`, and `Applications` (mapping users to jobs with statuses).
2. **Session Management:** Instead of a single local `auth.json` file, user session states (cookies/tokens) would be serialized and stored securely in a database (e.g., Redis or encrypted PostgreSQL fields) linked to the user's ID. When a background worker picks up an auto-apply task for User A, it retrieves User A's specific storage state and initializes the Playwright context with it.
3. **Queueing System:** Replace the linear `for` loop in `apply.js` with a message queue (e.g., RabbitMQ, Celery, or BullMQ). Frontend requests would enqueue "Apply" jobs. Background workers would pull from the queue, allowing concurrent applications across hundreds of users.
4. **Proxy Rotation:** To run headless browsers at scale for multiple users, requests must be routed through residential proxies to avoid rate-limiting and IP bans from the platform.
