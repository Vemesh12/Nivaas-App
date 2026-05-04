const service = require("../services/community.service");
const { sendSuccess } = require("../utils/response");

const createCommunity = async (req, res, next) => {
  try {
    sendSuccess(res, await service.createCommunity(req.user, req.body), 201);
  } catch (error) {
    next(error);
  }
};

const joinCommunity = async (req, res, next) => {
  try {
    sendSuccess(res, await service.joinCommunity(req.user, req.body.inviteCode));
  } catch (error) {
    next(error);
  }
};

const myCommunity = async (req, res, next) => {
  try {
    sendSuccess(res, { community: await service.getMyCommunity(req.user) });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCommunity, joinCommunity, myCommunity };
