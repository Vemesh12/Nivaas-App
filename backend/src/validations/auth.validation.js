const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(8),
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(6),
    flatNumber: z.string().min(1)
  })
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1),
    password: z.string().min(1)
  })
});

module.exports = { registerSchema, loginSchema };
