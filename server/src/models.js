import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['hr', 'manager', 'employee'], default: 'employee' },
  department: { type: String, default: 'General' },
  jobTitle: { type: String, default: 'Employee' }
}, { timestamps: true });
userSchema.set('toJSON', { transform: (_doc, ret) => { delete ret.password; delete ret.__v; return ret; } });

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Annual', 'Sick', 'Personal', 'Other'], default: 'Annual' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  checkIn: { type: Date, default: Date.now }
}, { timestamps: true });
attendanceSchema.index({ employee: 1, day: 1 }, { unique: true });

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Leave = mongoose.model('Leave', leaveSchema);
export const Attendance = mongoose.model('Attendance', attendanceSchema);
export const Announcement = mongoose.model('Announcement', announcementSchema);
