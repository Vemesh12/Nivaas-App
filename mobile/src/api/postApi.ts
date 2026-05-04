import { PostCategory } from "../types";
import axiosClient from "./axiosClient";

export const postApi = {
  list: (category?: PostCategory) => axiosClient.get("/posts", { params: category ? { category } : undefined }),
  create: (payload: { title: string; description: string; category: PostCategory; imageUrl?: string }) =>
    axiosClient.post("/posts", payload),
  get: (id: string) => axiosClient.get(`/posts/${id}`),
  update: (id: string, payload: Partial<{ title: string; description: string; category: PostCategory; imageUrl: string }>) =>
    axiosClient.put(`/posts/${id}`, payload),
  remove: (id: string) => axiosClient.delete(`/posts/${id}`),
  like: (id: string) => axiosClient.post(`/posts/${id}/like`),
  comment: (id: string, text: string) => axiosClient.post(`/posts/${id}/comments`, { text })
};
