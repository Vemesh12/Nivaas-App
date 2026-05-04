import axiosClient from "./axiosClient";

export const userApi = {
  directory: () => axiosClient.get("/users/directory"),
  updateProfile: (payload: { fullName?: string; email?: string; flatNumber?: string; profileImage?: string }) =>
    axiosClient.put("/users/profile", payload),
  updatePrivacy: (showPhoneNumber: boolean) => axiosClient.put("/users/privacy", { showPhoneNumber }),
  adminDashboard: () => axiosClient.get("/admin/dashboard"),
  pendingResidents: () => axiosClient.get("/admin/pending-residents"),
  approve: (id: string) => axiosClient.put(`/admin/users/${id}/approve`),
  reject: (id: string) => axiosClient.put(`/admin/users/${id}/reject`),
  remove: (id: string) => axiosClient.delete(`/admin/users/${id}`),
  pinPost: (id: string) => axiosClient.put(`/admin/posts/${id}/pin`),
  deletePostAsAdmin: (id: string) => axiosClient.delete(`/admin/posts/${id}`)
};
