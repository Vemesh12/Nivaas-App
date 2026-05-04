const prisma = require("../config/prisma");
const { publicUserSelect } = require("./auth.service");

const directory = (user) =>
  prisma.user.findMany({
    where: { communityId: user.communityId, status: "APPROVED" },
    orderBy: [{ flatNumber: "asc" }, { fullName: "asc" }],
    select: {
      id: true,
      fullName: true,
      flatNumber: true,
      phone: true,
      showPhoneNumber: true,
      profileImage: true
    }
  });

const updateProfile = (user, data) =>
  prisma.user.update({
    where: { id: user.id },
    data: { ...data, email: data.email || null, profileImage: data.profileImage || null },
    select: publicUserSelect
  });

const updatePrivacy = (user, showPhoneNumber) =>
  prisma.user.update({
    where: { id: user.id },
    data: { showPhoneNumber },
    select: publicUserSelect
  });

module.exports = { directory, updateProfile, updatePrivacy };
