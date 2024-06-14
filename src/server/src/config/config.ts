const Config = {
  HOST: process.env.HOST,
  PORT: Number(process.env.PORT) || 8000,
  NAME: process.env.NAME,
  EMAIL: process.env.MAIL,
  APPWRITE: {
    DATABASE_ID: process.env.APPWRITE_DATABASE_ID||"Azra_Hospital_ID",
    BUCKET_ID:process.env.APPWRITE_BUCKET_ID||"665f7a090031f1e3b1f0",
    HOSPITAL_COLLECTION_ID: process.env.APPWRITE_HOSPITAL_COLLECTION_ID||"Hospitals_Collection",
    PINGS_COLLECTION_ID:process.env.PINGS_COLLECTION_ID||"6660da5a001b1e74ab91",
    CHAT_COLLECTION_ID: process.env.CHAT_COLLECTION_ID||'<>',
    APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
    PROJECT_ID: process.env.PROJECT_ID||"665a709d0033a1c40e0b",
    MAIL_FUNCTION_ID:process.env.MAIL_FUNCTION_ID,
    APPWRITE_SECRET: process.env.APPWRITE_SECRET||"54c01ae771791cca7b355b80c8286f3f8527f4c1b0bbd2e0aeeb4bc1a24b4ea76065ef9e2ad5df92862532daf9514800f95c8be469664a5d9fee25a404912191a5e9a3e3c22e16da3e954d7838022a849e22f47d096d3bdba6fc7bae982c48c2faae9fcda59226a2570c0b1f0d8ea9c4e1ed233c49eb200349f990fc2d9f4138",
  },
  RATE_LIMITER: {
    WINDOW_MS: 5 * 60 * 1000, // 5 minute
    MAX: 100, // limit each IP to 40 requests per 5minute
    MESSAGE: "Too many requests, please try again later",
  },

  LOGGER: {
    LOG_STORAGE_PATH: "./.log",
    MAX_LOG_FILE: 3,
    MAX_LOG_FILE_SIZE: 15 << 20,
  },
};

export default Config;
