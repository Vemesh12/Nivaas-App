const { ZodError } = require("zod");

const sendError = (res, statusCode, message, errors = []) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((item) => ({ path: item.path.join("."), message: item.message }));
    return sendError(res, 400, errors[0]?.message || "Validation failed", errors);
  }

  if (err.type === "entity.too.large") {
    return sendError(res, 413, "Request body is too large.");
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendError(res, 400, "Request body must be valid JSON.");
  }

  const statusCode = err.statusCode || 500;
  sendError(res, statusCode, statusCode === 500 ? "Internal server error" : err.message);
};

module.exports = { notFound, errorHandler };
