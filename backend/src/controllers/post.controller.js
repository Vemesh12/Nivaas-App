const service = require("../services/post.service");
const { sendSuccess } = require("../utils/response");

const listPosts = async (req, res, next) => {
  try {
    sendSuccess(res, { posts: await service.listPosts(req.user, req.query.category) });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    sendSuccess(res, { post: await service.createPost(req.user, req.body) }, 201);
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    sendSuccess(res, { post: await service.getPost(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    sendSuccess(res, { post: await service.updatePost(req.user, req.params.id, req.body) });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    sendSuccess(res, await service.deletePost(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    sendSuccess(res, await service.toggleLike(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    sendSuccess(res, { comment: await service.addComment(req.user, req.params.id, req.body.text) }, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { listPosts, createPost, getPost, updatePost, deletePost, toggleLike, addComment };
