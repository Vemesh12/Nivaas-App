import axiosClient from "./axiosClient";

export const noticeApi = {
  list: () => axiosClient.get("/notices"),
  create: (payload: { title: string; description: string; isImportant: boolean }) => axiosClient.post("/notices", payload),
  update: (id: string, payload: Partial<{ title: string; description: string; isImportant: boolean }>) =>
    axiosClient.put(`/notices/${id}`, payload),
  remove: (id: string) => axiosClient.delete(`/notices/${id}`)
};
