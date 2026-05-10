const { z } = require("zod");

const category = z.enum(["GENERAL", "ALERT", "HELP", "LOST_FOUND", "EVENT"], {
  errorMap: () => ({ message: "Choose a valid post category." })
});

const listPostsSchema = z.object({
  query: z.object({
    category: category.optional()
  })
});

const createPostSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Post title is required." }).trim().min(3, "Title must be at least 3 characters."),
    description: z.string({ required_error: "Post description is required." }).trim().min(3, "Description must be at least 3 characters."),
    category: category.default("GENERAL"),
    imageUrl: z.string().trim().url("Enter a valid image URL, or leave it empty.").optional().or(z.literal(""))
  })
});

const updatePostSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").optional(),
    description: z.string().trim().min(3, "Description must be at least 3 characters.").optional(),
    category: category.optional(),
    imageUrl: z.string().trim().url("Enter a valid image URL, or leave it empty.").optional().or(z.literal(""))
  })
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) })
});

const commentSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ text: z.string({ required_error: "Comment text is required." }).trim().min(1, "Write a comment before posting.") })
});

module.exports = { listPostsSchema, createPostSchema, updatePostSchema, idParamSchema, commentSchema };
