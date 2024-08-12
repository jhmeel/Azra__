import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Config from "./src/config/config.js";
import CloudinaryProvider from "./src/providers/cloudinary.js";
import DBProvider from "./src/providers/dbProvider.js";
import { MiddlewaresProvider } from "./src/providers/middlewares.js";
import { RouteProvider } from "./src/providers/route.js";
import logger from "./src/utils/logger.js";
import Worker from "./worker.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap.get(receiverId);
};

io.on("connection", (socket) => {
  logger.info("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

 
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReceived", { senderId, message });
    }
  });

  socket.on("typing", ({ userId, receiverId }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { userId });
    }
  });

  socket.on("stopTyping", ({ userId, receiverId }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { userId });
    }
  });

  socket.on("disconnect", () => {
    logger.info("A user disconnected", socket.id);
    for (const [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key);
        break;
      }
    }
  });
});

const dependencyList = [ 
 // DBProvider.getInstance(Config),
  new CloudinaryProvider(Config),
  new MiddlewaresProvider(app),
  new RouteProvider(app),
];

const worker = Worker.getInstance(app, Config);

worker.addDependency(dependencyList);
worker.initializeDependencies();
worker.startPolling();

export { io, getReceiverSocketId };
 