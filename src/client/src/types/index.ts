/* eslint-disable @typescript-eslint/no-explicit-any */

import { Models } from "appwrite";

export type PatientSignupData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
};

export interface PingChatTabProps {
  pSelectedHospital: Hospital | null;
  pingDetails: Ping;
}

export type HospitalSignupData = {
  hospitalName: string;
  hospitalNumber: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  coordinates?: { lat: number; lng: number };
  acceptTerms?: boolean;
};

export type SignupFormData = PatientSignupData | HospitalSignupData;
export type Coordinate = {
  lat: number;
  lng: number;
};

export interface Message extends Models.Document {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "video" | "document";
  mediaUrl?: string;
  isEdited: boolean;
  isRead: boolean;
}

export type NearbySearchProp = {
  lat: number;
  lng: number;
  range: number;
  status: string;
};
export interface Hospital extends Models.Document {
  userId: string;
  hospitalName: string;
  hospitalNumber: string;
  avatar: string;
  availabilityStatus: string;
  email: string;
  phone: string;
  coordinates: string;
  lastActive?: string;
}

export enum Role {
  HOSPITAL = "HOSPITAL",
  PATIENT = "PATIENT",
}

export interface Patient extends Models.Document {
  userId: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  lastActive?: string;
}

export enum Severity {
  Critical = "Critical",
  Moderate = "Moderate",
  Minor = "Minor",
}

export type Ping = {
  $id?: string;
  hospitalId?: string;
  patientId?: string;
  patientName?: string;
  image?: string;
  date?: string;
  complaint: string;
  severity?: string;
  assignedPhysician?: string;
  status?: string;
};
export type Recommendation = {
  type: string;
  content: string;
  to: string;
};
export type PingUpdateProp = {
  assignedPhysician: string;
  patientName: string;
  date: string;
  status: string;
  complaints: string;
};

export interface Action {
  type: string;
  payload?: any;
}

