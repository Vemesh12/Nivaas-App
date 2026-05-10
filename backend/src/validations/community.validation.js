const { z } = require("zod");

const createCommunitySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Community name is required." }).trim().min(2, "Community name must be at least 2 characters."),
    city: z.string({ required_error: "City is required." }).trim().min(2, "City must be at least 2 characters."),
    area: z.string({ required_error: "Area is required." }).trim().min(2, "Area must be at least 2 characters.")
  })
});

const joinCommunitySchema = z.object({
  body: z.object({
    inviteCode: z.string({ required_error: "Invite code is required." }).trim().min(4, "Invite code looks too short.")
  })
});

module.exports = { createCommunitySchema, joinCommunitySchema };
