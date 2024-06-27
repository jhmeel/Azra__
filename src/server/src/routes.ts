import express from "express";
import {
  deleteHospitalById,
  deletePing,
  findNearbyHospitals,
  getAllHospials,
  getDashBoard,
  getHospitalByName,
  getHospitalPings,
  getHosptalById,

  pingHospital,
  updateHospitalById,
} from "./handlers/hospital.js";
import authorizer from "./middlewares/authorizer.js";
import { HospitalLogin, HospitalSignup,PatientSignup,PatientLogin, onPatientOauthSignUp, OnPatientOauthSignUpSuccess, BulkHospitalSignup } from "./handlers/auth.js";
import { getProfile } from "./handlers/patient.js";
const Router = express();

Router.route('/dev/h-seed').post(BulkHospitalSignup)

Router.route("/auth/h/signup").post(HospitalSignup);
Router.route("/auth/h/login").post(HospitalLogin);

//Hospital
Router.route("/dashboard").get(authorizer, getDashBoard);
Router.route("/hospital/:id").get(getHosptalById);
Router.route("/hospital/pings/:id").get(getHospitalPings);
Router.route("/hospitals").get(getAllHospials);
Router.route("/hospital/name").get(getHospitalByName);
Router.route("/hospitals/nearby").post(findNearbyHospitals);
Router.route("/hospital/:id")
  .put(updateHospitalById)
  .delete(deleteHospitalById);
Router.route("/ping").post(pingHospital);
Router.route("/ping/:id").put(()=>{});
Router.route("/hospital/:hospitalId/ping/:pingId").delete(deletePing);




Router.route("/auth/p/signup").post(PatientSignup);
Router.route("/auth/p/login").post(PatientLogin);

Router.route("/auth/p-oauth/signup").get(onPatientOauthSignUp);
Router.route("/auth/p-oauth/success").get(OnPatientOauthSignUpSuccess);



//Patient
Router.route("/profile").get(authorizer, getProfile);



Router.route("/chats/active").get(()=>{});
Router.route("chats-history/:chatId").get(()=>{})

export default Router;
