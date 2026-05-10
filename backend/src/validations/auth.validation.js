const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z.string({ required_error: "Full name is required." }).trim().min(2, "Enter your full name."),
    phone: z.string({ required_error: "Phone number is required." }).trim().min(8, "Enter a valid phone number."),
    email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
    password: z.string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
    flatNumber: z.string({ required_error: "Flat or house number is required." }).trim().min(1, "Enter your flat or house number.")
  })
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string({ required_error: "Phone or email is required." }).trim().min(1, "Enter your phone number or email."),
    password: z.string({ required_error: "Password is required." }).min(1, "Enter your password.")
  })
});

module.exports = { registerSchema, loginSchema };
