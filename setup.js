import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('========================================================');
console.log('📦  Setting up StaffSync MERN Application...');
console.log('========================================================\n');

// 1. Setup server .env
const serverEnv = path.join(__dirname, 'server', '.env');
const serverEnvExample = path.join(__dirname, 'server', '.env.example');
if (!fs.existsSync(serverEnv)) {
  if (fs.existsSync(serverEnvExample)) {
    fs.copyFileSync(serverEnvExample, serverEnv);
    console.log('✓ Created server/.env from template');
  } else {
    fs.writeFileSync(serverEnv, 'PORT=5000\nMONGO_URI=mongodb://127.0.0.1:27017/staffsync\nJWT_SECRET=staffsync-default-secret\nCLIENT_ORIGIN=http://localhost:5173\n');
    console.log('✓ Created default server/.env');
  }
} else {
  console.log('✓ server/.env already exists');
}

// 2. Setup client .env
const clientEnv = path.join(__dirname, 'client', '.env');
if (!fs.existsSync(clientEnv)) {
  fs.writeFileSync(clientEnv, 'VITE_API_URL=/api\n');
  console.log('✓ Created client/.env');
} else {
  console.log('✓ client/.env already exists');
}

// 3. Install Server Dependencies
const serverModules = path.join(__dirname, 'server', 'node_modules');
if (!fs.existsSync(serverModules)) {
  console.log('\n📥 Installing server dependencies (this may take a minute)...');
  execSync(`${npmCmd} install`, { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
} else {
  console.log('✓ Server dependencies are already installed');
}

// 4. Install Client Dependencies
const clientModules = path.join(__dirname, 'client', 'node_modules');
if (!fs.existsSync(clientModules)) {
  console.log('\n📥 Installing client dependencies (this may take a minute)...');
  execSync(`${npmCmd} install`, { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
} else {
  console.log('✓ Client dependencies are already installed');
}

// 5. Try seeding demo accounts
console.log('\n🌱 Checking database connection and seeding demo data...');
try {
  execSync(`${npmCmd} run seed`, { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
} catch (err) {
  console.log('⚠️  Note: Database seeding skipped. MongoDB might not be running locally.');
  console.log('    Once your MongoDB connection is ready, run: npm run seed\n');
}

console.log('\n========================================================');
console.log('🎉 Setup complete!');
console.log('👉 To start development: npm run dev  (or double-click run.bat)');
console.log('👉 To build and run:     npm run prod (or double-click build-and-run-prod.bat)');
console.log('========================================================\n');
