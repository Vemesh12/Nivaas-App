import axiosClient from "./axiosClient";

export const authApi = {
  register: (payload: {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    flatNumber: string;
  }) => axiosClient.post("/auth/register", payload),
  login: (payload: { identifier: string; password: string }) => axiosClient.post("/auth/login", payload),
  me: () => axiosClient.get("/auth/me")
};
