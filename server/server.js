import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"; // optional if you later verify tokens
// create express app and http server
const app = express();

const server = http.createServer(app);

// store online users as userId -> Set(socketId)
export const userSocketMap = {}; // { userId: Set([...socketIds]) }

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  // prefer handshake.auth (safer for reconnects) but fallback to query
  const userId =
    socket.handshake?.auth?.userId || socket.handshake?.query?.userId;
  console.log("Socket connected:", socket.id, "user:", userId);

  if (userId) {
    if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
    userSocketMap[userId].add(socket.id);
  }

  // Emit online users (only userIds that have at least 1 socket)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id, "user:", userId);
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connect_error", err.message);
  });
});

// middlewares

// maximum image size can be 4mb
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// Routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to mongoDB

await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`server is listening at localhost:${PORT}`);
  });
}

export default server;
