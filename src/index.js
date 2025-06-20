import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chat-frontend-murex.vercel.app",
    "https://chat-frontend-jpbkyyrkj-anas-projects-dfbef841.vercel.app"
  ],
  credentials: true
}));
app.get("/",(req,res)=>{
    res.send("working fine")
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});