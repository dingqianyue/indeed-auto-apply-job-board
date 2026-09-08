const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isRunning = false;

app.post('/api/apply', (req, res) => {
  if (isRunning) {
    return res.status(409).json({ error: 'Auto-apply script is already running.' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Job URL is required.' });
  }

  isRunning = true;
  console.log(`Starting auto-apply script for ${url}`);

  // In a real scenario, we'd pass the URL to the script.
  // For now, the script processes all "pending" jobs.
  const child = spawn('node', ['apply.js'], {
    cwd: path.join(__dirname, 'indeed-automation-test'),
    stdio: 'inherit' // Pipes output to the terminal where this server is running
  });

  child.on('close', (code) => {
    console.log(`Auto-apply script exited with code ${code}`);
    isRunning = false;
  });

  child.on('error', (err) => {
    console.error('Failed to start script:', err);
    isRunning = false;
  });

  res.json({ message: 'Auto-apply script started successfully. Please check the server terminal.' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Bridge server running on http://localhost:${PORT}`);
  console.log(`To trigger automation from the frontend, it will call POST /api/apply`);
});
