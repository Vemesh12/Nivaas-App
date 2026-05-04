const { z } = require("zod");

const createCommunitySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    city: z.string().min(2),
    area: z.string().min(2)
  })
});

const joinCommunitySchema = z.object({
  body: z.object({
    inviteCode: z.string().min(4)
  })
});

module.exports = { createCommunitySchema, joinCommunitySchema };
