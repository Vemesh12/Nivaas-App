const { z } = require("zod");

const noticeBody = z.object({
  title: z.string({ required_error: "Notice title is required." }).trim().min(3, "Title must be at least 3 characters."),
  description: z.string({ required_error: "Notice description is required." }).trim().min(3, "Description must be at least 3 characters."),
  isImportant: z.boolean().default(false)
});

const createNoticeSchema = z.object({ body: noticeBody });
const updateNoticeSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: noticeBody.partial()
});
const noticeIdSchema = z.object({ params: z.object({ id: z.string().min(1) }) });

module.exports = { createNoticeSchema, updateNoticeSchema, noticeIdSchema };
