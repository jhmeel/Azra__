import cloudinary from "cloudinary";
import logger from "../utils/logger.js";
import Emitter from "../utils/emitter.js";
import Config from "../config/config.js";

class CloudinaryProvider {
  _name;
  emitter;
  config;
  
  constructor(config:typeof Config) {
    this._name = "<CLOUDINARY_PROVIDER>";
    this.emitter = Emitter.getInstance();
    this.config = config;
  }

  async init() {
    try {
      logger.info(`initializing ${this._name}...`);

      cloudinary.v2.config({
        cloud_name: this.config.CLOUDINARY.CLOUDINARY_NAME,
        api_key: this.config.CLOUDINARY.CLOUDINARY_API_KEY,
        api_secret: this.config.CLOUDINARY.CLOUDINARY_API_SECRET,
      });

      this.emitter.emit(`${this._name}Ready`);

      logger.info(`${this._name} initialized!`);
    } catch (err:any) {
      logger.error(`Failed to initialize ${this._name}: ${err.message}`);
      throw err;
    }
  }
}

export default CloudinaryProvider;
