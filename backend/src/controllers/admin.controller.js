const adminService = require("../services/admin.service");
const postService = require("../services/post.service");
const { sendSuccess } = require("../utils/response");

const dashboard = async (req, res, next) => {
  try {
    sendSuccess(res, await adminService.dashboard(req.user));
  } catch (error) {
    next(error);
  }
};

const pendingResidents = async (req, res, next) => {
  try {
    sendSuccess(res, { residents: await adminService.pendingResidents(req.user) });
  } catch (error) {
    next(error);
  }
};

const approveUser = async (req, res, next) => {
  try {
    sendSuccess(res, { user: await adminService.approveUser(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
};

const rejectUser = async (req, res, next) => {
  try {
    sendSuccess(res, { user: await adminService.rejectUser(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    sendSuccess(res, await adminService.removeUser(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
};

const pinPost = async (req, res, next) => {
  try {
    sendSuccess(res, { post: await adminService.pinPost(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    sendSuccess(res, await postService.deletePost(req.user, req.params.id, true));
  } catch (error) {
    next(error);
  }
};

module.exports = { dashboard, pendingResidents, approveUser, rejectUser, removeUser, pinPost, deletePost };
