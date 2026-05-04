const service = require("../services/notice.service");
const { sendSuccess } = require("../utils/response");

const listNotices = async (req, res, next) => {
  try {
    sendSuccess(res, { notices: await service.listNotices(req.user) });
  } catch (error) {
    next(error);
  }
};

const createNotice = async (req, res, next) => {
  try {
    sendSuccess(res, { notice: await service.createNotice(req.user, req.body) }, 201);
  } catch (error) {
    next(error);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    sendSuccess(res, { notice: await service.updateNotice(req.user, req.params.id, req.body) });
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    sendSuccess(res, await service.deleteNotice(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
};

module.exports = { listNotices, createNotice, updateNotice, deleteNotice };
