const { z } = require("zod");

const category = z.enum(["GENERAL", "ALERT", "HELP", "LOST_FOUND", "EVENT"]);

const listPostsSchema = z.object({
  query: z.object({
    category: category.optional()
  })
});

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    category: category.default("GENERAL"),
    imageUrl: z.string().url().optional().or(z.literal(""))
  })
});

const updatePostSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(3).optional(),
    category: category.optional(),
    imageUrl: z.string().url().optional().or(z.literal(""))
  })
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) })
});

const commentSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ text: z.string().min(1) })
});

module.exports = { listPostsSchema, createPostSchema, updatePostSchema, idParamSchema, commentSchema };
