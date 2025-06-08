import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow all origins for simplicity; adjust as needed
  },
});

export function getReciverSocketId(userId) {
  // This function retrieves the socket ID for a given user ID
  return userSocketMap[userId];
}

// used to store online userS
const userSocketMap = {}; //{userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id; // Store the socket ID for the user
  //    io.emit() is used to send events to all the  connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId]; // Remove the socket ID for the user
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Notify all clients about the updated online users
  });
});

export { io, server, app };
