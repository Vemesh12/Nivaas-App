const { z } = require("zod");

const noticeBody = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  isImportant: z.boolean().default(false)
});

const createNoticeSchema = z.object({ body: noticeBody });
const updateNoticeSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: noticeBody.partial()
});
const noticeIdSchema = z.object({ params: z.object({ id: z.string().min(1) }) });

module.exports = { createNoticeSchema, updateNoticeSchema, noticeIdSchema };
