import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Role } from "../types";

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: Record<string, string>;
}

const baseUrl = 'https://distinct-reward-nosy-attraction.pipeops.app'
//'http://localhost:3000';
const axiosInstance = (token?: string, role?: Role): AxiosInstance => {
  const config: AxiosInstanceConfig = {
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Bearer:${token}`;
  }
  config.headers["role"] = role || "<>";
  return axios.create(config);
};

export default axiosInstance;
