const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { AppError } = require("../utils/response");

const publicUserSelect = {
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
};

const register = async (payload) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ phone: payload.phone }, ...(payload.email ? [{ email: payload.email }] : [])] }
  });
  if (existing) throw new AppError("Phone or email is already registered", 409);

  const user = await prisma.user.create({
    data: {
      ...payload,
      email: payload.email || null,
      password: await hashPassword(payload.password)
    },
    select: publicUserSelect
  });

  return { user, token: signToken(user) };
};

const login = async ({ identifier, password }) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone: identifier }, { email: identifier }] }
  });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const { password: _password, ...safeUser } = user;
  return { user: safeUser, token: signToken(user) };
};

module.exports = { register, login, publicUserSelect };
