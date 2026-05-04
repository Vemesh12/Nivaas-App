import axiosClient from "./axiosClient";

export const communityApi = {
  create: (payload: { name: string; city: string; area: string }) => axiosClient.post("/communities", payload),
  join: (inviteCode: string) => axiosClient.post("/communities/join", { inviteCode }),
  myCommunity: () => axiosClient.get("/communities/my-community")
};
