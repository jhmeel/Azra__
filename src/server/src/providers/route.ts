import Emitter from "../utils/emitter.js";
import logger from "../utils/logger.js";
import os from "os";
import { errorMiddleware } from "../middlewares/error.js";
import { Express } from "express";
import Router from "../routes.js";

class RouteProvider {
  _name: string;
  app: Express;
  emitter: Emitter;
  constructor(app: Express) {
    this._name = "<ROUTES_PROVIDER>";
    this.app = app;
    this.emitter = Emitter.getInstance();
  }
  async init() {
    try {
      logger.info(`initializing ${this._name}...`);

      this.app.use("/api/v1", Router);

      this.app.use(errorMiddleware);

      this.app.route("/healthz").get(async (req, res, next) => {
        const MIN_UP_TIME = 60;
        const uptime = process.uptime();
        const is_healthy = uptime >= MIN_UP_TIME;
        const status = {
          status: is_healthy
            ? "UP"
            : uptime < MIN_UP_TIME && uptime > 0
            ? "INITIALIZING..."
            : "DOWN",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          hostname: os.hostname(),
          cpu: os.cpus,
          cpuUsage: process.cpuUsage,
          memoryUsage: process.memoryUsage,
          loadAverage: os.loadavg(),
          freeMemory: os.freemem(),
          totalMemory: os.totalmem(),
        };
        res.status(200).json(status);
      });

      this.emitter.emit(`${this._name}Ready`);

      logger.info(`${this._name} initialized! `);
    } catch (err) {
      throw err;
    }
  }
}

export { RouteProvider };
