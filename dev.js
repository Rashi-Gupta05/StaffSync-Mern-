import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/.env exists
const serverEnvPath = path.join(__dirname, 'server', '.env');
const serverEnvExample = path.join(__dirname, 'server', '.env.example');
if (!fs.existsSync(serverEnvPath) && fs.existsSync(serverEnvExample)) {
  fs.copyFileSync(serverEnvExample, serverEnvPath);
  console.log('✓ Created server/.env from template.');
}

console.log('========================================================');
console.log('🚀  Starting StaffSync (Backend + Frontend)...');
console.log('========================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Spawn backend server
const server = spawn(`${npmCmd} run dev`, {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Spawn frontend client
const client = spawn(`${npmCmd} run dev`, {
  cwd: path.join(__dirname, 'client'),
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

function pipeOutput(stream, prefix, colorCode) {
  stream.on('data', data => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim().length > 0) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    }
  });
}

pipeOutput(server.stdout, 'SERVER', '36'); // Cyan
pipeOutput(server.stderr, 'SERVER', '31'); // Red
pipeOutput(client.stdout, 'CLIENT', '32'); // Green
pipeOutput(client.stderr, 'CLIENT', '33'); // Yellow

function cleanup() {
  console.log('\nShutting down StaffSync servers...');
  try {
    if (isWindows) {
      if (server.pid) spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
      if (client.pid) spawn('taskkill', ['/pid', client.pid.toString(), '/f', '/t']);
    } else {
      server.kill('SIGTERM');
      client.kill('SIGTERM');
    }
  } catch (err) {
    // ignore cleanup errors on exit
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
