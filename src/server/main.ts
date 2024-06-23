import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import Config from "./src/config/config.js";
import logger from "./src/utils/logger.js";
import Router from "./src/routes.js";
import { errorMiddleware } from "./src/middlewares/error.js";
dotenv.config();

const app = express();

  
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

// Server Listen
const PORT = Config.PORT;
ViteExpress.listen(app, PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
