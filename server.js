const express = require("express");
const { spawn } = require("child_process");
const http = require("http");

const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 2525;

app.use(express.static("public"));

// matching executable path
const matchingExecutablePath = "./matching_engine";
const matching = spawn(matchingExecutablePath);

// Middleware to parse request bodies
app.use(express.json());

// Keep track of connected clients using remote addresses
const connectedClients = new Map();

wss.on("connection", (ws, req) => {
  const remoteAddress = req.connection.remoteAddress;

  console.log(`Client connected from ${remoteAddress}`);
  connectedClients.set(remoteAddress, ws);

  // Forward matching output to WebSocket clients
  matching.stdout.on("data", (data) => {
    ws.send(data.toString());
  });

  // Receive commands from WebSocket clients
  ws.on("message", (message) => {
    matching.stdin.write(`${message}\n`);
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log(`Client disconnected from ${remoteAddress}`);
    connectedClients.delete(remoteAddress);
  });
});

// Start the Express and WebSocket server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});