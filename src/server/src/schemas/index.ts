import Joi from "@hapi/joi";

export const hospitalSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
  hospitalName: Joi.string().required(),
  hospitalNumber: Joi.string().required(),
  coordinates: Joi.string().required(), // "lat,lng"
  avatar: Joi.object({
    secureUrl: Joi.string().uri().optional(),
    publicId: Joi.string().optional(),
  }).optional(),
  verificationDocuments: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(),
        secureUrl: Joi.string().uri().required(),
        publicId: Joi.string().required(),
      })
    )
    .optional(),
  rating: Joi.number().optional(),
});

export const patientSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
  fullName: Joi.string().required(),
  avatar: Joi.object({
    secureUrl: Joi.string().uri().optional(),
    publicId: Joi.string().optional(),
  }).optional(),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
