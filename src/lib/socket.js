// server.js or socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();

// CORS setup (adjust origin as needed)
app.use(cors({
  origin: [ "https://chat-frontend-murex.vercel.app"], // <== Replace with actual frontend URL
  credentials: true,
}));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [ "https://chat-frontend-murex.vercel.app"], // <== Replace with actual frontend URL
    methods: ["GET", "POST"],
  },
});

// Map to store connected users
const userSocketMap = {}; // Format: { userId: socketId }

// Get receiver socket ID
export function getReciverSocketId(userId) {
  return userSocketMap[userId];
}

// Handle socket connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Notify all clients of the current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export for use in main app
export { io, server, app };
