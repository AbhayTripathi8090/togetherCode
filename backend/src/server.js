import fs from "fs";
import http from "http";
import path from "path";

import express from "express";
import { Server } from "socket.io";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { registerCollaborationHandlers } from "./socket/registerCollaborationHandlers.js";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.corsOrigins,
    methods: ["GET", "POST"],
  },
});

registerCollaborationHandlers(io);

if (env.serveStaticFrontend) {
  const indexFilePath = path.join(env.frontendDistPath, "index.html");

  if (fs.existsSync(indexFilePath)) {
    app.use(express.static(env.frontendDistPath));
    app.get(/.*/, (_req, res) => {
      res.sendFile(indexFilePath);
    });
  } else {
    console.warn(
      `Frontend build not found at ${env.frontendDistPath}. Static serving is disabled.`,
    );
  }
}

server.listen(env.port, () => {
  console.log(`Backend server running on http://localhost:${env.port}`);
});
