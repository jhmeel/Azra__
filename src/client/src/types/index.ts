/* eslint-disable @typescript-eslint/no-explicit-any */
export type SignupFormData = {
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
  hospitalName: string;
  hospitalNumber: string;
  coordinates: { lat: number; lng: number };
  acceptTerms: boolean;
};

export type Hospital = {
  $id: string;
  hospitalName: string;
  hospitalNumber: string;
  avatar: string;
  status: boolean;
  email: string;
  phone: string;
  coordinates: string;
};

export type Ping = {
  hospitalId?: string;
  fullname: string;
  image?: string;
  complaints: string;
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
