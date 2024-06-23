const Config = {
    HOST: import.meta.env.HOST,
    PORT: Number(import.meta.env.PORT) || 3000,
    NAME: import.meta.env.NAME,
    EMAIL: import.meta.env.MAIL,
   MESSAGES_PER_PAGE : 20,
    APPWRITE: {
      DATABASE_ID: import.meta.env.APPWRITE_DATABASE_ID||"Azra_Hospital_ID",
      PATIENT_COLLECTION_ID: import.meta.env.PATIENTS_COLLECTION_ID||'6677611500084a07a518',
      BUCKET_ID:import.meta.env.APPWRITE_BUCKET_ID||"665f7a090031f1e3b1f0",
      HOSPITAL_COLLECTION_ID: import.meta.env.APPWRITE_HOSPITAL_COLLECTION_ID||"Hospitals_Collection",
      PINGS_COLLECTION_ID:import.meta.env.PINGS_COLLECTION_ID||"6660da5a001b1e74ab91",
      HOSPIAL_MESSAGES_COLLECTION_ID: import.meta.env.HOSPIAL_MESSAGES_COLLECTION_ID||'<>',
      APPWRITE_ENDPOINT: "https://cloud.appwrite.io/v1",
      PROJECT_ID: import.meta.env.PROJECT_ID||"665a709d0033a1c40e0b",
      MAIL_FUNCTION_ID:import.meta.env.MAIL_FUNCTION_ID,
      APPWRITE_SECRET: import.meta.env.APPWRITE_SECRET||"54c01ae771791cca7b355b80c8286f3f8527f4c1b0bbd2e0aeeb4bc1a24b4ea76065ef9e2ad5df92862532daf9514800f95c8be469664a5d9fee25a404912191a5e9a3e3c22e16da3e954d7838022a849e22f47d096d3bdba6fc7bae982c48c2faae9fcda59226a2570c0b1f0d8ea9c4e1ed233c49eb200349f990fc2d9f4138",
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
    }
  };
  
  export default Config;
  