const prisma = require("../config/prisma");
const { AppError } = require("../utils/response");

const makeInviteCode = (name) =>
  `${name.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const createCommunity = async (user, data) => {
  if (user.communityId) throw new AppError("You already belong to a community", 400);

  const community = await prisma.community.create({
    data: {
      ...data,
      inviteCode: makeInviteCode(data.name),
      createdById: user.id
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN", status: "APPROVED", communityId: community.id }
  });

  return { community, user: updatedUser };
};

const joinCommunity = async (user, inviteCode) => {
  if (user.communityId) throw new AppError("You already belong to a community", 400);
  const community = await prisma.community.findUnique({ where: { inviteCode } });
  if (!community) throw new AppError("Invalid invite code", 404);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { communityId: community.id, status: "PENDING", role: "RESIDENT" }
  });

  return { community, user: updatedUser };
};

const getMyCommunity = (user) => {
  if (!user.communityId) throw new AppError("You are not part of a community", 404);
  return prisma.community.findUnique({
    where: { id: user.communityId },
    include: {
      _count: { select: { members: true, posts: true, notices: true } }
    }
  });
};

module.exports = { createCommunity, joinCommunity, getMyCommunity };
