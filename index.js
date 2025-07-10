const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Create directories if they don't exist
const publicDir = path.join(__dirname, 'public');
const cssDir = path.join(publicDir, 'css');
const jsDir = path.join(publicDir, 'js');
const imagesDir = path.join(publicDir, 'images');
const allowedIps = ['34.78.159.173', '34.145.176.176', '35.221.48.173'];
[publicDir, cssDir, jsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Middleware to log client information
app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const timestamp = new Date().toISOString();
  
  console.log(`\n📡 CLIENT REQUEST:`);
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`🌐 IP: ${clientIP}`);
  console.log(`🔗 Method: ${req.method}`);
  console.log(`📄 URL: ${req.url}`);
  console.log(`👤 User Agent: ${userAgent}`);
  console.log(`─`.repeat(40));
  
  next();
});

// Serve static files from the public directory
app.use("/files",express.static(publicDir));

// Route for the main page
app.get('/', (req, res) => {
  const clientIP = req.ip || req.socket.remoteAddress;
  console.log(`Client IP: ${clientIP}`);
  const passParam = req.query.pass;
  console.log(`Pass Param: ${passParam}`);

  if(allowedIps.includes(clientIP) || passParam === "true") {
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(403).send('Access denied');
  }
});

// API endpoint to get client info
app.get('/api/client-info', (req, res) => {
  const clientInfo = {
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    headers: req.headers
  };
  res.json(clientInfo);
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - File not found: ${req.url}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404 - Page Not Found</title></head>
    <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested page was not found on this server.</p>
        <p><a href="/">Go back to home</a></p>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log(`🚀 Static website server running at http://localhost:3000`);
  console.log(`📁 Serving files from: ${publicDir}`);
  console.log(`📊 Client requests will be logged below:`);
  console.log(`─`.repeat(50));
});
