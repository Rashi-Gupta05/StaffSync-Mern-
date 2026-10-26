import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models.js';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffsync';

try {
  console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]{3,})@/, ':****@')} ...`);
  await mongoose.connect(mongoUri);

  const demos = [
    { name: 'StaffSync HR', email: 'hr@staffsync.demo', role: 'hr', department: 'Human Resources', jobTitle: 'HR Administrator' },
    { name: 'StaffSync Manager', email: 'manager@staffsync.demo', role: 'manager', department: 'Engineering', jobTitle: 'Team Manager' },
    { name: 'StaffSync Employee', email: 'employee@staffsync.demo', role: 'employee', department: 'Engineering', jobTitle: 'Software Engineer' }
  ];

  for (const d of demos) {
    const exists = await User.findOne({ email: d.email });
    if (!exists) {
      await User.create({ ...d, password: await bcrypt.hash('StaffSync123!', 10) });
      console.log(`✓ Created demo account: ${d.email} (${d.role})`);
    } else {
      console.log(`ℹ Demo account exists: ${d.email}`);
    }
  }

  console.log('\n Demo accounts are ready!');
  console.log('Credentials:');
  console.log(' - HR       : hr@staffsync.demo       / StaffSync123!');
  console.log(' - Manager  : manager@staffsync.demo  / StaffSync123!');
  console.log(' - Employee : employee@staffsync.demo / StaffSync123!\n');
  await mongoose.disconnect();
} catch (err) {
  console.error('\n❌ Database seeding failed:');
  console.error(err.message);
  console.error('\nMake sure MongoDB is running or specify MONGO_URI in server/.env\n');
  process.exit(1);
}
