import express from "express";
import {
  deleteHospitalById,
  deletePing,
  findNearbyHospitals,
  getAllHospials,
  getHospitalByName,
  getHospitalPings,
  getHosptalById,
  getProfile,
  pingHospital,
  updateHospitalById,
} from "./handlers/hospital.js";
import authorizer from "./middlewares/authorizer.js";
import { Login, Signup } from "./handlers/auth.js";
const Router = express();

Router.route("/auth/signup").post(Signup);
Router.route("/auth/login").post(Login);

Router.route("/profile").get(authorizer, getProfile);

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

Router.route("/chats/active").get(()=>{});
Router.route("chats-history/:chatId").get(()=>{})

export default Router;
