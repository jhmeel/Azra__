import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Role } from "../types";

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: Record<string, string>;
}
const baseUrl = window.location.protocol.includes("https")
  ? "'https://azra.onrender.com'm"
  : "http://127.0.0.1:3000";

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
