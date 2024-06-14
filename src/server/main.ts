import express from "express";
import ViteExpress from "vite-express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import Config from "./src/config/config.js";
import logger from "./src/utils/logger.js";
import Router from "./src/routes.js";
import ChatController from "./src/chat.js";
import { errorMiddleware } from "./src/middlewares/error.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);


// Get the current file URL and convert it to a path
const __filename = fileURLToPath(import.meta.url);
// Get the directory path of the current file
const __dirname = path.dirname(__filename);

// Serve static client files from the dist directory
const distDir = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distDir));

// Middleware

app.use(compression());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  if (req.url.includes("/api")) {
    logger.info(
      `NEW REQUEST: IP ${req.ip || req.connection.remoteAddress} => ${
        req.method
      } ${req.url}`
    );
  }

  next();
});

// Routes
app.use("/api/v1", Router);
app.use(errorMiddleware);

// Chat Controller
const chatController = new ChatController(io);

// Socket.io connection
io.on("connection", (socket) => {
  chatController.handleConnection(socket);
});

// Server Listen
const PORT = Config.PORT;
ViteExpress.listen(app, PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
