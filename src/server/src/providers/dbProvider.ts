import mongoose from "mongoose";
import Config from "../config/config.js";
import logger from "../utils/logger.js";
import Emitter from "../utils/emitter.js";

class DBProvider {
  private static _instance: DBProvider | null = null;
  private static mongooseInitialized = false;
  private dbUrl?: string;
  _name: string;
  private emitter: Emitter;

  private constructor(config: typeof Config) {
    this.dbUrl = config.MONGOOSE.URI;
    this._name = "<DATABASE_PROVIDER>";
    this.emitter = Emitter.getInstance();
  }

  public static getInstance(): DBProvider;
  public static getInstance(config: typeof Config): DBProvider;
  public static getInstance(config?: typeof Config): DBProvider {
    if (!DBProvider._instance) {
      if (!config) {
        throw new Error("Config must be provided when creating DBProvider instance");
      }
      DBProvider._instance = new DBProvider(config);
    }
    return DBProvider._instance;
  }

  public async init(): Promise<void> {
    try {
      await this.initializeMongoose();
    } catch (error: any) {
      this.emitter.emit("CONNECTION_ERROR", error);
      logger.error("Failed to establish database connection:", error.message);
    }
  }

  private async initializeMongoose(): Promise<void> {
    if (!DBProvider.mongooseInitialized) {
      if (!this.dbUrl) {
        throw new Error("Database URL is not set");
      }

      mongoose.connection.on("connected", () => {
        this.emitter.emit(`${this._name}Ready`);
        logger.info(`${this._name} initialized! `);
      });

      mongoose.connection.on("error", (error) => {
        logger.error("[Mongodb] Connection error:", error);
        this.emitter.emit("MONGOOSE_ERROR", error);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("[Mongodb] Connection disconnected!");
        this.emitter.emit("MONGOOSE_DISCONNECTED");
      });

      await mongoose.connect(this.dbUrl);
      DBProvider.mongooseInitialized = true;
      this.emitter.emit("CONNECTED");
      logger.info("Database connection established!");
    }
  }

  public async closeConnections(): Promise<void> {
    try {
      if (DBProvider.mongooseInitialized) {
        await mongoose.disconnect();
        DBProvider.mongooseInitialized = false;
        logger.info("[Mongodb] Connection closed!");
      }
    } catch (error: any) {
      this.emitter.emit("CLOSE_CONNECTION_ERROR", error);
      logger.error("Failed to close database connection:", error.message);
    }
  }
}

export default DBProvider;