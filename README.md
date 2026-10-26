# StaffSync — Modern Human Resource Management Solution (MERN)

StaffSync is a full-stack HR management web application built on the **MERN Stack** (MongoDB, Express.js, React, Node.js). It streamlines core organizational HR workflows, featuring distinct role-based access for **HR Administrators**, **Managers**, and **Employees**.

---

## ⚡ Direct 1-Click Execution (Windows)

You can run the application directly using the pre-configured Windows batch files:

| File | Purpose | Action |
| :--- | :--- | :--- |
| **`run.bat`** | **Run Full App in Development** | Double-click to install any missing dependencies, start both backend (`:5000`) and frontend (`:5173`), and auto-open your browser. |
| **`build-and-run-prod.bat`** | **Production Build & Server** | Builds the React frontend with Vite and serves the entire app on a single port (`http://localhost:5000`). |
| **`seed-demo.bat`** | **Seed Demo Accounts** | Populates your MongoDB database with the 3 default demo accounts. |

---

## 💻 Running via Terminal (Cross-Platform)

### 1. One-Time Setup
```bash
npm run setup
```
*(Automatically creates `.env` files and installs dependencies for both `server` and `client`)*

### 2. Seed Demo Accounts
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- API Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Demo Accounts

All demo accounts use the default password: **`StaffSync123!`**

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **HR** | `hr@staffsync.demo` | `StaffSync123!` | Create employees, view all records, review leave requests, post company announcements |
| **Manager** | `manager@staffsync.demo` | `StaffSync123!` | Review & approve/reject leave requests, view department employees, post announcements |
| **Employee** | `employee@staffsync.demo` | `StaffSync123!` | Check-in daily attendance, submit leave requests, view announcements & team directory |

---

## 🗄️ Database Setup (MongoDB)

StaffSync requires a MongoDB connection. You have two easy options:

### Option A: Free Cloud Database (MongoDB Atlas — Recommended)
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a **Free M0 Cluster**.
2. Under **Database Access**, create a user (e.g. `staffsync_user` and a password).
3. Under **Network Access**, click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **Connect** → **Drivers** and copy your connection string.
5. In `server/.env`, set:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/staffsync?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB
Ensure the MongoDB service is running on your machine:
```bash
# In Windows PowerShell / Command Prompt (as Administrator):
net start MongoDB
```
Or start `mongod` directly. The default URI is `mongodb://127.0.0.1:27017/staffsync`.

---

## 🚀 Free Cloud Deployment

For detailed, step-by-step instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Deploying Full-Stack to Render.com (Free)
1. Push this repository to **GitHub**.
2. In [Render](https://render.com), create a **New Web Service** connected to your repository.
3. Configure:
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `<any-random-secret-string>`
   - `MONGO_URI` = `<your-mongodb-atlas-connection-string>`
5. Click **Deploy**!

### Deploying with Docker
```bash
docker compose up --build
```
Spins up MongoDB, the StaffSync application, and Mongo-Express admin UI (`:8081`).

---

## 📁 Repository Structure

```
StaffSync-MERN-Starter/
├── run.bat                   # ⚡ 1-Click Windows development launcher
├── build-and-run-prod.bat    # ⚡ 1-Click Windows production build & run
├── seed-demo.bat             # ⚡ 1-Click Windows demo data seed
├── package.json              # Root package script coordinator
├── dev.js                    # Cross-platform concurrent dev runner
├── setup.js                  # Automated dependency & environment installer
├── Dockerfile                # Multi-stage production container
├── docker-compose.yml        # Multi-container stack (App + MongoDB + Admin UI)
├── render.yaml               # Render Cloud Blueprint for 1-click deployment
├── Procfile                  # Railway / Heroku deployment descriptor
├── DEPLOYMENT.md             # Complete step-by-step deployment guide
│
├── server/                   # Backend Express & MongoDB API
│   ├── .env                  # Server environment variables
│   ├── package.json
│   └── src/
│       ├── index.js          # API routes, auth & static frontend serving
│       ├── models.js         # User, Leave, Attendance, Announcement schemas
│       └── seed.js           # Demo data seeder script
│
└── client/                   # Frontend React (Vite) Single-Page App
    ├── .env                  # Client environment variables
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx           # Complete StaffSync HRM UI
        ├── main.jsx          # React DOM entrypoint
        └── style.css         # Modern, responsive styling
```
