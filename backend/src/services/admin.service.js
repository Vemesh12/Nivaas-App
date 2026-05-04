const prisma = require("../config/prisma");
const { AppError } = require("../utils/response");
const postService = require("./post.service");

const pendingResidents = (user) =>
  prisma.user.findMany({
    where: { communityId: user.communityId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: { id: true, fullName: true, phone: true, flatNumber: true, createdAt: true }
  });

const ensureUserInCommunity = async (admin, id) => {
  const member = await prisma.user.findFirst({ where: { id, communityId: admin.communityId } });
  if (!member) throw new AppError("User not found in your community", 404);
  return member;
};

const approveUser = async (admin, id) => {
  await ensureUserInCommunity(admin, id);
  return prisma.user.update({ where: { id }, data: { status: "APPROVED" } });
};

const rejectUser = async (admin, id) => {
  await ensureUserInCommunity(admin, id);
  return prisma.user.update({ where: { id }, data: { status: "REJECTED" } });
};

const removeUser = async (admin, id) => {
  const member = await ensureUserInCommunity(admin, id);
  if (member.id === admin.id) throw new AppError("Admin cannot remove themselves", 400);
  await prisma.user.delete({ where: { id } });
  return { id };
};

const dashboard = async (user) => {
  const [pendingResidentsCount, totalMembers, totalPosts] = await Promise.all([
    prisma.user.count({ where: { communityId: user.communityId, status: "PENDING" } }),
    prisma.user.count({ where: { communityId: user.communityId, status: "APPROVED" } }),
    prisma.post.count({ where: { communityId: user.communityId } })
  ]);
  return { pendingResidentsCount, totalMembers, totalPosts };
};

const pinPost = async (admin, id) => {
  const post = await postService.getPostInCommunity(id, admin.communityId);
  return prisma.post.update({ where: { id }, data: { isPinned: !post.isPinned } });
};

module.exports = { pendingResidents, approveUser, rejectUser, removeUser, dashboard, pinPost };
