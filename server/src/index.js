import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { User, Leave, Attendance, Announcement } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));

const auth = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please log in.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Account not found.' });
    req.user = user; next();
  } catch { return res.status(401).json({ message: 'Invalid or expired token.' }); }
};
const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action.' });
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, department: u.department, jobTitle: u.jobTitle });
const tokenFor = u => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '12h' });

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'StaffSync API' }));
app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password)))
    return res.status(401).json({ message: 'Invalid email or password.' });
  res.json({ token: tokenFor(user), user: safeUser(user) });
});
app.get('/api/auth/me', auth, (req, res) => res.json({ user: safeUser(req.user) }));

app.get('/api/employees', auth, async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users.map(safeUser));
});
app.post('/api/employees', auth, allow('hr'), async (req, res) => {
  const { name, email, password, role, department, jobTitle } = req.body;
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email, and password (at least 8 characters) are required.' });
  try {
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: ['hr','manager','employee'].includes(role) ? role : 'employee', department, jobTitle });
    res.status(201).json(safeUser(user));
  } catch (e) { res.status(400).json({ message: e.code === 11000 ? 'Email already exists.' : 'Could not create employee.' }); }
});

app.get('/api/leaves', auth, async (req, res) => {
  const filter = req.user.role === 'employee' ? { employee: req.user._id } : {};
  const leaves = await Leave.find(filter).populate('employee', 'name email department').populate('reviewedBy', 'name').sort({ createdAt: -1 });
  res.json(leaves);
});
app.post('/api/leaves', auth, async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;
  if (!startDate || !endDate || !reason || endDate < startDate) return res.status(400).json({ message: 'Enter valid dates and a reason.' });
  const leave = await Leave.create({ employee: req.user._id, type, startDate, endDate, reason });
  res.status(201).json(await leave.populate('employee', 'name email department'));
});
app.patch('/api/leaves/:id', auth, allow('hr','manager'), async (req, res) => {
  if (!['Approved','Rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
  const leave = await Leave.findByIdAndUpdate(req.params.id, { status: req.body.status, reviewedBy: req.user._id }, { new: true }).populate('employee', 'name email department').populate('reviewedBy', 'name');
  if (!leave) return res.status(404).json({ message: 'Leave request not found.' });
  res.json(leave);
});

app.get('/api/attendance', auth, async (req, res) => {
  const filter = req.user.role === 'employee' ? { employee: req.user._id } : {};
  res.json(await Attendance.find(filter).populate('employee', 'name email department').sort({ day: -1 }).limit(100));
});
app.post('/api/attendance/check-in', auth, async (req, res) => {
  const day = new Date().toISOString().slice(0, 10);
  try {
    const record = await Attendance.create({ employee: req.user._id, day });
    res.status(201).json(record);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'You have already checked in today.' });
    throw e;
  }
});

app.get('/api/announcements', auth, async (_req, res) => res.json(await Announcement.find().populate('author', 'name role').sort({ createdAt: -1 })));
app.post('/api/announcements', auth, allow('hr','manager'), async (req, res) => {
  const { title, body } = req.body;
  if (!title?.trim() || !body?.trim()) return res.status(400).json({ message: 'Title and message are required.' });
  res.status(201).json(await Announcement.create({ title: title.trim(), body: body.trim(), author: req.user._id }));
});

// Serve static frontend build if it exists (for single-server production deployment)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error. Check the server terminal.' });
});

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync';

mongoose.connect(mongoUri)
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log('\n=================================================');
      console.log(` StaffSync Server running at: http://localhost:${port}`);
      if (fs.existsSync(clientDistPath)) {
        console.log(` Web App ready at:           http://localhost:${port}`);
      }
      console.log(` API Health check:            http://localhost:${port}/api/health`);
      console.log(` Database:                    Connected to MongoDB`);
      console.log('=================================================\n');
    });
  })
  .catch(err => {
    console.error('\n=================================================');
    console.error(' MongoDB connection failed:');
    console.error(err.message);
    console.error('\n Troubleshooting:');
    console.error(' 1. If using local MongoDB, ensure MongoDB is started:');
    console.error('    net start MongoDB (or run mongod)');
    console.error(' 2. If using MongoDB Atlas, configure MONGO_URI in server/.env:');
    console.error('    MONGO_URI=mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/staffsync');
    console.error(' 3. If using Docker, run:');
    console.error('    docker compose up');
    console.error('=================================================\n');
    process.exit(1);
  });
