const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional().or(z.literal("")),
    flatNumber: z.string().min(1).optional(),
    profileImage: z.string().url().optional().or(z.literal(""))
  })
});

const privacySchema = z.object({
  body: z.object({
    showPhoneNumber: z.boolean()
  })
});

module.exports = { updateProfileSchema, privacySchema };
