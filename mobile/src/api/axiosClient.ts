import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("nivaas_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      const message = error.code === "ECONNABORTED"
        ? "The backend took too long to respond. Check that the server is running."
        : "Backend is not reachable. Check your API URL, Wi-Fi, tunnel, and backend server.";
      return Promise.reject(Object.assign(new Error(message), { code: error.code }));
    }

    const data = error.response.data || {};
    const validationMessage = Array.isArray(data.errors) && data.errors[0]?.message
      ? data.errors[0].message
      : undefined;
    const message = data.message === "Validation failed" && validationMessage ? validationMessage : data.message;

    return Promise.reject(Object.assign(new Error(message || "Something went wrong."), {
      status: error.response.status,
      errors: data.errors
    }));
  }
);

export default axiosClient;
