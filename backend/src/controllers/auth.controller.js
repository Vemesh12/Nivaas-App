const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    sendSuccess(res, await authService.register(req.body), 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    sendSuccess(res, await authService.login(req.body));
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => sendSuccess(res, { user: req.user });

module.exports = { register, login, me };
