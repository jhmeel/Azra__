import Joi from "@hapi/joi";

export const hospitalSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required(),
  password: Joi.string().min(8).required(),
  confirmPassword:Joi.string().min(8).required(),
  hospitalName: Joi.string().required(),
  hospitalNumber: Joi.string().required(), 
  coordinates: Joi.string().required(),  //"lat,lng"
});

export const patientSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required(),
  password: Joi.string().min(8).required(),
  confirmPassword:Joi.string().min(8).required(),
  fullName: Joi.string().required(),
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


export const updatePatientSchema = Joi.object({
  email: Joi.string().email().optional(),
  fullName: Joi.string().optional(),
  avatar: Joi.string().optional(),
});


export const updatePingSchema = Joi.object({
  assignedPhysician: Joi.string().required(),
  status: Joi.string().required(),
});

export const getHospitalsNearCoordinatesSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  status: Joi.string().required(),
  range: Joi.number().required(), // range in km
});
