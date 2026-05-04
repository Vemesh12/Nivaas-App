export type Role = "RESIDENT" | "ADMIN";
export type UserStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PostCategory = "GENERAL" | "ALERT" | "HELP" | "LOST_FOUND" | "EVENT";

export type User = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  flatNumber: string;
  profileImage?: string | null;
  role: Role;
  status: UserStatus;
  showPhoneNumber: boolean;
  communityId?: string | null;
};

export type Community = {
  id: string;
  name: string;
  city: string;
  area: string;
  inviteCode: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  category: PostCategory;
  imageUrl?: string | null;
  isPinned: boolean;
  createdAt: string;
  author: Pick<User, "id" | "fullName" | "flatNumber">;
  _count?: { comments: number; likes: number };
  comments?: Comment[];
  likedByMe?: boolean;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  author: Pick<User, "id" | "fullName" | "flatNumber">;
};

export type Notice = {
  id: string;
  title: string;
  description: string;
  isImportant: boolean;
  createdAt: string;
};
