import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    phone: {
      type: String,
      required: true,
      minlength: [11, "Phone number must be at least 11 characters long."],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long."],
    },
    googleId: { 
      type: String,
  
       },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Patient",
    },
    avatar: {
      secureUrl: { type: String },
      publicId: { type: String },
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
