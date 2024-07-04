const Config = {
  VERSION:1,
  HOST: process.env.HOST,
  PORT: Number(process.env.PORT) || 3000,
  NAME: process.env.NAME,
  EMAIL: process.env.MAIL,
  BASE_URL:"",
  JWT: {
    JWT_SECRETE_KEY: process.env.JWT_SECRET_KEY||'AZRA_JWT_SECRETE',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN||'30d', 
  },
  SESSION: {
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY||'0987543WERTYUIKJHGFDSDFGHJK',
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE||'30',
  },
  RESET_PASSWORD: {
    RESET_PASSWORD_EXPIRY: Date.now() + 5 * 60 * 1000, //5mins
  },
  VERIFY_TOKEN: {
    VERIFY_TOKEN_EXPIRY: Date.now() + 10 * 60 * 1000, //10mins 
  },
  RATE_LIMITER: {
    WINDOW_MS: 5 * 60 * 1000, // 5 minute
    MAX: 500, // limit each IP to 500 requests per 5minute
    MESSAGE: "Too many requests, please try again in the next 5 minutes",
  },

  LOGGER: {
    LOG_STORAGE_PATH: "./.log",
    MAX_LOG_FILE: 3,
    MAX_LOG_FILE_SIZE: 15 << 20,
  },
  MAX_ASYNC_RETRY: 3,

  MONGOOSE: { 
    URI: process.env.DB_URI||'mongodb+srv://Jhmeel:08081434@cluster0.rdnm2n6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  },
  CRYPTO:{
    KEY:process.env.CRYPTO_KEY||'qwertyuiujhgfbivndcxjbhtyrtertryui',
  },
  CLOUDINARY: {
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME||'fcstore',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY||'779893887235886',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET||'sf0M9K2EDJY3_EUrHnXFmUkLrMs',
  },
  WEBPUSH: {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VAPID_SUBJECT: process.env.VAPID_SUBJECT,
  },
  REDIS: {
    TTL: 60,
  },

  CHAT_ENGINE: {
    PROJECT_ID: '1e21c9e5-48e1-4b4a-9a23-f68174096474',
    SECRET:'496a3369-24ac-409b-a3ce-cfdf525fecbd'
  },
  
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
    CLIENT_SECRET: 'YOUR_GOOGLE_CLIENT_SECRET',
  },

};

export default Config;
