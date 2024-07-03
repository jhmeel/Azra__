import mongoose from "mongoose";

const pingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    complaint: { type: String, required: true },
    severity: { type: String, required: true },
    image: {
      secureUrl: { type: String },
      publicId: { type: String },
    },
    assignedPhysicians: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Physician",
        default:'None'
      },
    ],
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: true }
);
const Ping = mongoose.model("Ping", pingSchema);
export default Ping
