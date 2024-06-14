import Joi from "@hapi/joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required(),
  password: Joi.string().min(8).required(),
  hospitalName: Joi.string().required(),
  hospitalNumber: Joi.string().required(), 
  coordinates: Joi.string().required(),  //"lat,lng"
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
export const getHospitalByNameSchema = Joi.object({
  name: Joi.string().required(),
});
export const getHospitalByIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const patientPingSchema = Joi.object({
  fullname: Joi.string().required(),
  complaint: Joi.string().required(),
  hospitalId: Joi.string().required(),
  image: Joi.string().optional(),
});

export const updateHospitalSchema = Joi.object({
  email: Joi.string().email().optional(),
  hospitalName: Joi.string().optional(),
  hospitalNumber: Joi.string().optional(),
  coordinates: Joi.string().optional(),  //"lat,lng"
  avatar: Joi.string().optional(),
  availabilityStatus: Joi.string().optional(),
});

export const getHospitalsNearCoordinatesSchema = Joi.object({
  lat: Joi.string().required(),
  lng: Joi.string().required(),
  range: Joi.string().required(), // range in km
});
