const prisma = require("../config/prisma");
const { AppError } = require("../utils/response");

const includePost = {
  author: { select: { id: true, fullName: true, flatNumber: true } },
  _count: { select: { comments: true, likes: true } }
};

const getPostInCommunity = async (id, communityId) => {
  const post = await prisma.post.findFirst({ where: { id, communityId }, include: includePost });
  if (!post) throw new AppError("Post not found", 404);
  return post;
};

const listPosts = (user, category) =>
  prisma.post.findMany({
    where: { communityId: user.communityId, ...(category ? { category } : {}) },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: includePost
  });

const createPost = (user, data) =>
  prisma.post.create({
    data: { ...data, imageUrl: data.imageUrl || null, authorId: user.id, communityId: user.communityId },
    include: includePost
  });

const getPost = async (user, id) => {
  const post = await prisma.post.findFirst({
    where: { id, communityId: user.communityId },
    include: {
      ...includePost,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, fullName: true, flatNumber: true } } }
      },
      likes: { where: { userId: user.id }, select: { id: true } }
    }
  });
  if (!post) throw new AppError("Post not found", 404);
  return { ...post, likedByMe: post.likes.length > 0 };
};

const updatePost = async (user, id, data) => {
  const post = await getPostInCommunity(id, user.communityId);
  if (post.authorId !== user.id) throw new AppError("You can edit only your own posts", 403);
  return prisma.post.update({
    where: { id },
    data: { ...data, imageUrl: data.imageUrl || null },
    include: includePost
  });
};

const deletePost = async (user, id, adminOverride = false) => {
  const post = await getPostInCommunity(id, user.communityId);
  if (!adminOverride && post.authorId !== user.id) {
    throw new AppError("You can delete only your own posts", 403);
  }
  await prisma.post.delete({ where: { id } });
  return { id };
};

const toggleLike = async (user, postId) => {
  await getPostInCommunity(postId, user.communityId);
  const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId: user.id } } });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }
  await prisma.like.create({ data: { postId, userId: user.id } });
  return { liked: true };
};

const addComment = async (user, postId, text) => {
  await getPostInCommunity(postId, user.communityId);
  return prisma.comment.create({
    data: { postId, text, authorId: user.id },
    include: { author: { select: { id: true, fullName: true, flatNumber: true } } }
  });
};

module.exports = { listPosts, createPost, getPost, updatePost, deletePost, toggleLike, addComment, getPostInCommunity };
