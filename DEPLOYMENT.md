# 🚀 StaffSync - Deployment & Quick Start Guide

**StaffSync** is a modern Human Resource Management (HRM) web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It provides distinct role-based dashboards and permissions for **HR**, **Managers**, and **Employees**.

---

## ⚡ Quick Options to Run Directly

| Option | Method | When to Use |
| :--- | :--- | :--- |
| **Option 1: Windows 1-Click** | Double-click `run.bat` | Fastest for Windows users |
| **Option 2: Terminal / NPM** | `npm run dev` | Cross-platform (Windows, Mac, Linux) |
| **Option 3: Docker Compose** | `docker compose up` | Zero local setup (MongoDB included) |
| **Option 4: Production Single Server** | `npm run prod` (or `build-and-run-prod.bat`) | Full app on a single port (`5000`) |
| **Option 5: Cloud Deployment** | Render, Railway, or Vercel | Free public hosting |

---

## 🔑 Default Demo Accounts

The project includes pre-configured demo accounts. Password for all three is **`StaffSync123!`**:

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| 🧑‍💼 **HR Admin** | `hr@staffsync.demo` | `StaffSync123!` | Create employees, review all leave requests, post announcements, view full company directory |
| 👔 **Manager** | `manager@staffsync.demo` | `StaffSync123!` | Review/approve leave requests, post team announcements, view employee list |
| 👨‍💻 **Employee** | `employee@staffsync.demo` | `StaffSync123!` | Check-in daily attendance, submit leave requests, view announcements & directory |

---

## 🛠️ Option 1: 1-Click Run on Windows (Direct Execution)

1. **Start the App:**
   - Double-click **`run.bat`** in the project root folder.
   - It will automatically:
     - Check Node.js and npm
     - Create `.env` configuration files if missing
     - Install any missing backend & frontend dependencies
     - Start both the Express server (`:5000`) and Vite React app (`:5173`)
     - Open your default browser directly to `http://localhost:5173`

2. **Seed Demo Accounts (One-Time):**
   - Double-click **`seed-demo.bat`** to insert the demo accounts into your database.

---

## 💻 Option 2: Run via Terminal (Cross-Platform)

### Step 1: Install Dependencies & Setup
```bash
npm run setup
```
*(Or manually run `npm install --prefix server && npm install --prefix client`)*

### Step 2: Seed Demo Accounts
```bash
npm run seed
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🐳 Option 3: Run with Docker (Includes MongoDB)

If you have Docker Desktop installed, you don't even need MongoDB or Node installed on your machine!

```bash
docker compose up --build
```
- **Web Application:** http://localhost:5000
- **MongoDB Database:** `mongodb://localhost:27017`
- **Mongo Express Web UI:** http://localhost:8081

---

## ☁️ Option 4: Deploying to Free Cloud Platforms

### A. Deploy Full-Stack to Render.com (Recommended - 100% Free)

Render can run both your React frontend and Express backend from a single service:

1. Push your repository to **GitHub**.
2. Sign in to [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Select your GitHub repository.
4. Set the following build and start settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
5. Add Environment Variables in the Render Dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `<generate-any-random-32-char-string>`
   - `MONGO_URI` = `<your-mongodb-atlas-uri>` *(see MongoDB Atlas setup below)*
6. Click **Deploy Web Service**!

---

### B. Free MongoDB Atlas Database Setup (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and sign up for a **Free M0 Cluster**.
2. Under **Database Access**, create a user (e.g. username `staffsync_admin`, password `SecurePass123`).
3. Under **Network Access**, click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **Connect** → **Drivers** (Node.js) → Copy the connection string.
5. Replace `<password>` with your database password:
   ```env
   MONGO_URI=mongodb+srv://staffsync_admin:SecurePass123@cluster0.abcde.mongodb.net/staffsync?retryWrites=true&w=majority
   ```
6. Paste this `MONGO_URI` into `server/.env` (for local use) or into your Render/Railway environment variables (for cloud deployment).

---

### C. Deploy to Vercel (Frontend) + Render / Railway (Backend)

If you prefer splitting frontend and backend:
1. **Deploy Backend (`server/`):**
   - Push to Render or Railway.
   - Note down the deployed URL (e.g., `https://staffsync-api.onrender.com`).
2. **Deploy Frontend (`client/`):**
   - Connect the repo to [Vercel](https://vercel.com).
   - Set Root Directory to `client`.
   - Add Environment Variable:
     - `VITE_API_URL` = `https://staffsync-api.onrender.com/api`
   - Deploy!

---

## 📁 File Structure Reference

```
StaffSync-MERN-Starter/
│
├── run.bat                   # ⚡ 1-Click Windows development launcher
├── build-and-run-prod.bat    # ⚡ 1-Click Windows production build & run
├── seed-demo.bat             # ⚡ 1-Click Windows demo data seed
│
├── package.json              # Root package script coordinator
├── dev.js                    # Cross-platform concurrent dev runner
├── setup.js                  # Automated dependency & environment installer
│
├── Dockerfile                # Multi-stage production container
├── docker-compose.yml        # Multi-container stack (App + MongoDB + Admin UI)
├── render.yaml               # Render Cloud Blueprint for 1-click deployment
├── Procfile                  # Railway / Heroku deployment descriptor
│
├── server/                   # Backend Express & MongoDB API
│   ├── .env                  # Server environment variables (port, mongo_uri, jwt)
│   ├── package.json
│   └── src/
│       ├── index.js          # API routes, auth middleware & static serving
│       ├── models.js         # User, Leave, Attendance, Announcement schemas
│       └── seed.js           # Demo data seeder script
│
└── client/                   # Frontend React (Vite) Single-Page App
    ├── .env                  # Client environment variables (VITE_API_URL)
    ├── package.json
    ├── vite.config.js
    ├── vercel.json           # SPA rewrites for Vercel
    └── src/
        ├── App.jsx           # Complete StaffSync HRM UI
        ├── main.jsx          # React DOM entrypoint
        └── style.css         # Modern, responsive styling
```
