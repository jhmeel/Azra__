import session, { SessionOptions } from "express-session";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import Config from "../config/config.js";
import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";
import Emitter from "../utils/emitter.js";
import { Application } from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

const { SESSION_MAX_AGE, SESSION_SECRET_KEY } = Config.SESSION;
const { WINDOW_MS, MAX, MESSAGE } = Config.RATE_LIMITER;

class MiddlewaresProvider {
  app: Application;
  emitter: Emitter;
  _name: string;
  session: any;

  constructor(app: Application) {
    this._name = "<MIDDLEWARES_PROVIDER>";
    this.app = app;
    this.emitter = Emitter.getInstance();
  }

  async init() {
    const limiter = rateLimit({
      windowMs: WINDOW_MS,
      max: MAX,
      message: MESSAGE,
      standardHeaders: true,
      legacyHeaders: false,
    });

    try {
      logger.info(`initializing ${this._name}...`);
      this.app.use(bodyParser.json({ limit: "50mb" }));
      this.app.use(
        bodyParser.urlencoded({
          limit: "50mb",
          extended: true,
          parameterLimit: 50000,
        })
      );
      this.app.use(cors());
      //this.app.use(helmet());
      this.app.disable("x-powered-by");

      const sessionConfig: SessionOptions = {
        secret: SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
          sameSite: "none",
          path: "/",
          httpOnly: true,
          maxAge: Number(SESSION_MAX_AGE),
          secure: true,
        },
      };

      if (this.app.get("env") === "production") {
        this.app.set("trust proxy", 1); // trust first proxy
        //sessionConfig.cookie['secure'] = true; // Serve secure cookies over HTTPS
      }

      this.session = session(sessionConfig);
      this.app.use(this.session);
      this.app.use(passport.initialize());
      this.app.use(passport.session());

      this.app.use(limiter);
      this.app.use(compression());
      this.app.use(cookieParser());

      this.emitter.emit(`${this._name}Ready`);
      logger.info(`${this._name} initialized!`);
    } catch (err) {
      throw err;
    }
  }
}

export { MiddlewaresProvider };
