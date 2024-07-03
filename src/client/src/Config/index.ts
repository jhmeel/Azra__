const Config = {
  HOST: import.meta.env.HOST,
  PORT: Number(import.meta.env.PORT) || 3000,
  NAME: import.meta.env.NAME,
  EMAIL: import.meta.env.MAIL,
  BASE_URL: "",
  CHAT_ENGINE: {
    PROJECT_ID: '1e21c9e5-48e1-4b4a-9a23-f68174096474',
    SECRET:'496a3369-24ac-409b-a3ce-cfdf525fecbd'
  },
  SOCIALS: {
    instagram: {
      url: "",
      name: "Azra",
    },
    facebook: {
      url: "",
      name: "Azra",
    },
    twitter: {
      url: "",
      name: "Azra",
    },
    linkedIn: {
      url: "",
      name: "Azra",
    },
  },
};

export default Config;
