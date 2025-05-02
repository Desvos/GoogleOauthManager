// Simple script to start Vite directly
import { exec } from 'child_process';

console.log('Starting Vite server...');
const viteProcess = exec('cd client && npx vite', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});

viteProcess.stdout.on('data', (data) => {
  console.log(data);
});

viteProcess.stderr.on('data', (data) => {
  console.error(data);
});