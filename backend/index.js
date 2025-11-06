import express, { response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import axios from "axios";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app port
    methods: ["GET", "POST"],
  },
});

// Store room users: Map<roomId, Set<userName>>
const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  let currRoom = null;
  let currUser = null;

  // Join a room
  socket.on("join", ({ roomId, userName }) => {
    // If already in a room, leave it
    if (currRoom) {
      socket.leave(currRoom);
      if (rooms.has(currRoom)) {
        rooms.get(currRoom).delete(currUser);
        io.to(currRoom).emit("userJoined", Array.from(rooms.get(currRoom)));
      }
    }

    currRoom = roomId;
    currUser = userName;

    socket.join(currRoom);
    if (!rooms.has(currRoom)) {
      rooms.set(currRoom, new Set());
    }
    rooms.get(currRoom).add(currUser);

    io.to(currRoom).emit("userJoined", Array.from(rooms.get(currRoom)));
    console.log(`${userName} joined room ${roomId}`);
  });

  // Broadcast code changes
  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  // Typing indicator
  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange",({roomId,language})=>{
    io.to(roomId).emit("languageUpdate",language)
  })


socket.on("compileCode", async ({ code, roomId, language, version }) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        { language, version, files: [{ content: code }] }
      );
      room.output = response.data.run?.output || "";
      io.to(roomId).emit("codeResponse", response.data);
    } catch (err) {
      console.error("Execution error:", err.response?.data || err.message);
      io.to(roomId).emit("codeError", {
        message: err.response?.data?.message || "Execution failed",
      });
    }
  }
});



  // Leave room manually
  socket.on("leaveRoom", () => {
    if (currRoom && currUser) {
      if (rooms.has(currRoom)) {
        rooms.get(currRoom).delete(currUser);
        io.to(currRoom).emit("userJoined", Array.from(rooms.get(currRoom)));
      }
      socket.leave(currRoom);
      currRoom = null;
      currUser = null;
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (currRoom && currUser) {
      if (rooms.has(currRoom)) {
        rooms.get(currRoom).delete(currUser);
        io.to(currRoom).emit("userJoined", Array.from(rooms.get(currRoom)));
      }
    }
  });
});

const port = process.env.PORT || 5000;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


server.listen(port, () => {
  console.log("Server running on http://localhost:5000");
});
