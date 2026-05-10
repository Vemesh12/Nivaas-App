const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data, errors: [] });
};

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = { sendSuccess, AppError };
