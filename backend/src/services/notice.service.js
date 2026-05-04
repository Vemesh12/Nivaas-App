const prisma = require("../config/prisma");
const { AppError } = require("../utils/response");

const findNotice = async (id, communityId) => {
  const notice = await prisma.notice.findFirst({ where: { id, communityId } });
  if (!notice) throw new AppError("Notice not found", 404);
  return notice;
};

const listNotices = (user) =>
  prisma.notice.findMany({
    where: { communityId: user.communityId },
    orderBy: [{ isImportant: "desc" }, { createdAt: "desc" }],
    include: { createdBy: { select: { id: true, fullName: true } } }
  });

const createNotice = (user, data) =>
  prisma.notice.create({
    data: { ...data, communityId: user.communityId, createdById: user.id }
  });

const updateNotice = async (user, id, data) => {
  await findNotice(id, user.communityId);
  return prisma.notice.update({ where: { id }, data });
};

const deleteNotice = async (user, id) => {
  await findNotice(id, user.communityId);
  await prisma.notice.delete({ where: { id } });
  return { id };
};

module.exports = { listNotices, createNotice, updateNotice, deleteNotice };
