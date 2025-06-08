import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app , server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
         "https://chat-frontend-sigma-rouge.vercel.app",
    "https://chat-frontend-q58quh21k-anas-projects-dfbef841.vercel.app"
    ],
    credentials: true,
  })
);

app.use("/api/auth", authroutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server started on port PORT:", +PORT);
  connectDB();
});
