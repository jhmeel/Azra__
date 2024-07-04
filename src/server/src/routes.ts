import express from "express";
import {
  getMajorDisorders,
  findNearbyHospitals,
  getAllHospitals,
  updatePasswordHospital,
  updatePasswordPatient,
  resetPassword,
  getHospitalPings,
  forgotPasswordHospital,
  forgotPasswordPatient,
  createReview,
  deleteReview,
  updatePatientProfile,
  updateReview,
  getHospitalById,
  updateHospitalProfile,
  getPatientProfile,
  getHospitals,
} from "./handlers/main.js";
import passport from "passport";
import "./handlers/auth.js";
import authorizer from "./middlewares/authorizer.js";
import {
  HospitalLogin,
  HospitalSignup,
  PatientSignup,
  PatientLogin,
  BulkHospitalSignup,
} from "./handlers/auth.js";
import {
  updatePing,
  deletePing,
  hSendMessage,
  hDeleteMessage,
  pingHospital,
  hpSendMessage,
  hpUpdateMessage,
  hpDeleteMessage,
  getHMessages,
  getHPMessages,
} from "./handlers/message.js";

const Router = express();

Router.route("/dev/h-seed").post(BulkHospitalSignup);

Router.route("/auth/h/signup").post(HospitalSignup);
Router.route("/auth/h/login").post(HospitalLogin);
Router.route("/auth/p/signup").post(PatientSignup);
Router.route("/auth/p/login").post(PatientLogin);

Router.route("/h/forgot-password").post(forgotPasswordHospital);
Router.route("/p/forgot-password").post(forgotPasswordPatient);

Router.route("/reset-password/:resetToken").put(resetPassword);

Router.route("/profile/h/:hospitalId").put(authorizer, updateHospitalProfile);
Router.route("/password/h/:hospitalId").put(authorizer, updatePasswordHospital);
Router.route("/profile/p/:patientId").put(authorizer, updatePatientProfile);
Router.route("/password/p/:patientId").put(updatePasswordPatient);
Router.route("/new-review/:hospitalId").post(authorizer, createReview);
Router.route("/reviews/:reviewId")
  .delete(authorizer, deleteReview)
  .put(authorizer, updateReview);

Router.route("/ping")
  .post(authorizer, pingHospital)
  .put(authorizer, updatePing)
  .delete(authorizer, deletePing);

Router.route("/hospital/:id")
  .get(getHospitalById)
  .put(authorizer, updateHospitalProfile);

Router.route("/hospital/pings/:id").get(getHospitalPings);
Router.route("/hospitals").get(getAllHospitals);
Router.route("/hospitals/nearby").post(findNearbyHospitals);
Router.route("/hospital/:hospitalId/ping/:pingId").delete(deletePing);

Router.route("/patient/profile").get(authorizer, getPatientProfile);

// Google OAuth Sign-up/Log-in
Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
Router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

Router.get("/active-chat", authorizer, getHospitals);
Router.get("/h-chats-history/:id", authorizer, getHMessages);
Router.post("/h-message-send/:id", authorizer, hSendMessage);
Router.route("/h-message/delete/:messageId/:receiverId").post(
  authorizer,
  hDeleteMessage
);

Router.post("/p-message-send/:id", authorizer, hpSendMessage);
Router.get("/p-chats-history/:id", authorizer, getHPMessages);
Router.route("/p-message/delete/:messageId/:receiverId").post(
  authorizer,
  hpDeleteMessage
);
Router.route("/p-message/update").put(authorizer, hpUpdateMessage);

export default Router;
