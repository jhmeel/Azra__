import { Patient } from "./models/patient.js";
import { Hospital } from "./models/hospital.js";

export type User = typeof Patient | typeof Hospital;
export interface Disorder {
    name: string;
  }
  
  export interface DisorderCount {
    disorder: string;
    count: number;
  }