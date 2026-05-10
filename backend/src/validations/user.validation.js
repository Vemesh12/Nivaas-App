const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2, "Enter your full name.").optional(),
    email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
    flatNumber: z.string().trim().min(1, "Enter your flat or house number.").optional(),
    profileImage: z.string().trim().url("Enter a valid image URL, or leave it empty.").optional().or(z.literal(""))
  })
});

const privacySchema = z.object({
  body: z.object({
    showPhoneNumber: z.boolean()
  })
});

module.exports = { updateProfileSchema, privacySchema };
