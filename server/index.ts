// This is a placeholder server file that just redirects to the client
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.join(__dirname, '..', 'client');

console.log('Starting Vite development server for frontend-only application...');

// Start Vite development server on port 5000
const viteProcess = spawn('npx', ['vite', '--port', '5000'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

// Handle Vite process events
viteProcess.on('error', (error) => {
  console.error(`Failed to start Vite: ${error.message}`);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down Vite server...');
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down Vite server...');
  viteProcess.kill('SIGTERM');
});