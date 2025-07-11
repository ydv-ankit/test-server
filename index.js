const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("trust proxy", true);

const publicDir = path.join(__dirname, "public");
const allowedIps = [
	"34.78.159.173",
	"34.145.176.176",
	"35.221.48.173",
	"157.48.206.133",
];

// Route for the main page
app.get("/", (req, res) => {
	console.log("headers", req.headers);
	console.log("ip", req.ip);
	console.log("socket", req.socket.remoteAddress);
	const clientIP =
		req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	console.log(`Client IP: ${clientIP}`);
	const queryPassParam = req.query.pass;
	console.log("queryPassParam", queryPassParam);
	if (queryPassParam === "true") {
		allowedIps.push(clientIP);
	} else if (queryPassParam === "false") {
		allowedIps = allowedIps.filter((ip) => ip !== clientIP);
	}

	res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

// IP-based access control middleware
const checkIpAccess = (req, res, next) => {
	const clientIP =
		req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
	const isAllowed = allowedIps.includes(clientIP);

	console.log(`🔒 IP Access Check:`);
	console.log(`   Client IP: ${clientIP}`);
	console.log(`   Allowed IPs: ${allowedIps.join(", ")}`);
	console.log(`   Access: ${isAllowed ? "✅ GRANTED" : "❌ DENIED"}`);

	if (!isAllowed) {
		console.log(`🚫 Access denied for IP: ${clientIP}`);
		return res.status(403).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Access Denied</title></head>
      <body>
          <h1>403 - Access Denied</h1>
          <p>Your IP address (${clientIP}) is not authorized to access this server.</p>
          <p>Please contact the administrator for access.</p>
      </body>
      </html>
    `);
	}

	next();
};

// Apply IP check to static files
app.use("/files", checkIpAccess, express.static(publicDir));

// API endpoint to get client info
app.get("/api/client-info", (req, res) => {
	const clientInfo = {
		ip: req.ip || req.socket.remoteAddress,
		userAgent: req.get("User-Agent"),
		timestamp: new Date().toISOString(),
		headers: req.headers,
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
	console.log(`🔒 Allowed IPs: ${allowedIps.join(", ")}`);
	console.log(`📊 Client requests will be logged below:`);
	console.log(`─`.repeat(50));
});
