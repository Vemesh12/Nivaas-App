const service = require("../services/user.service");
const { sendSuccess } = require("../utils/response");

const directory = async (req, res, next) => {
  try {
    const residents = await service.directory(req.user);
    sendSuccess(res, { residents: residents.map((r) => ({ ...r, phone: r.showPhoneNumber ? r.phone : null })) });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    sendSuccess(res, { user: await service.updateProfile(req.user, req.body) });
  } catch (error) {
    next(error);
  }
};

const updatePrivacy = async (req, res, next) => {
  try {
    sendSuccess(res, { user: await service.updatePrivacy(req.user, req.body.showPhoneNumber) });
  } catch (error) {
    next(error);
  }
};

module.exports = { directory, updateProfile, updatePrivacy };
