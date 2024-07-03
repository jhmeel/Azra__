import { asyncRetry } from "./src/utils/retryAsync.js";
import logger from "./src/utils/logger.js";
import Emitter from "./src/utils/emitter.js";
import ErrorHandler from "./src/handlers/errorHandler.js";
import Config from "./src/config/config.js";
import ViteExpress from "vite-express";
import { Express } from "express";

class Worker {
  private dependencies: { [key: string]: any } = {};
  readyPercentage: number;
  config: typeof Config;
  RETRIES: any;
  emitter: Emitter;
  port: any;
  app: Express;
  static instance: Worker;
  constructor(app: Express, config: typeof Config) {
    logger.info(`Starting Worker... V${config.VERSION}`);
    this.dependencies = {};
    this.readyPercentage = 0;
    this.config = config;
    this.RETRIES = this.config.MAX_ASYNC_RETRY;
    this.emitter = Emitter.getInstance();
    this.port = this.config.PORT;
    this.app = app;
  }

  initServer() {
    ViteExpress.listen(this.app, this.port, () => {
      this.emitter.emit("SYSTEM:READY:STATE", "100");
      logger.info(`server running on port ${this.port}`);
    });
  }

  addDependency(dependencies: Array<any>) {
    for (const dependency of dependencies) {
      this.dependencies[dependency._name] = dependency;
      this.listenForDependencyReady(dependency._name);
    }
  }

  listenForDependencyReady(name:string) {
    logger.info(`[Worker] Listening for ${name} ready state...`);
    this.emitter.on(`${name}Ready`, () => {
      this.dependencies[name] = true;
      logger.info(`${name} is ready`);
      this.updateReadyPercentage();
    });
  }

  startPolling() {
    const intervalId = setInterval(() => {
      if (this.readyPercentage === 100) {
        logger.info("System is 100% ready!!");
        logger.info("Boostrapping System...");
        this.initServer();
        clearInterval(intervalId);
      } else {
        logger.info(`[Worker] System is ${this.readyPercentage}% ready...`);
      }
    }, 500);
    return this;
  }

  updateReadyPercentage() {
    const numOfDependencies = Object.keys(this.dependencies).length;
    const numOfReadyDependencies = Object.values(this.dependencies).filter(
      (status) => status === true
    ).length;
    this.readyPercentage = Math.round(
      (numOfReadyDependencies / numOfDependencies) * 100
    );
  }

  static getInstance(app: Express, config: typeof Config) {
    if (!Worker.instance) {
      Worker.instance = new Worker(app, config);
    }
    return Worker.instance;
  }

  async initializeDependencies() {
    if (!this.dependencies) {
      throw new ErrorHandler(500, "[Worker]: Missing dependencies... ");
    }

    try {
      for (const [name, dependency] of Object.entries(this.dependencies)) {
        await asyncRetry(this.RETRIES)(dependency.init());
      }
      return this;
    } catch (error) {
      throw new ErrorHandler(
        500,
        `[Worker]: Error initializing dependencies: ${error}`
      );
    }
  }
}

export default Worker ;
