const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/jwt");
const { AppError } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError("Authentication required", 401);

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        flatNumber: true,
        profileImage: true,
        role: true,
        status: true,
        showPhoneNumber: true,
        communityId: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) throw new AppError("User no longer exists", 401);
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError("Invalid or expired token", 401));
  }
};

const requireApproved = (req, res, next) => {
  if (req.user.status !== "APPROVED") {
    return next(new AppError("Your account is waiting for community admin approval", 403));
  }
  if (!req.user.communityId) {
    return next(new AppError("Join a community before using this resource", 403));
  }
  next();
};

module.exports = { protect, requireApproved };
