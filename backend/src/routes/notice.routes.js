const router = require("express").Router();
const controller = require("../controllers/notice.controller");
const validate = require("../middleware/validate.middleware");
const requireRole = require("../middleware/role.middleware");
const { protect, requireApproved } = require("../middleware/auth.middleware");
const { createNoticeSchema, updateNoticeSchema, noticeIdSchema } = require("../validations/notice.validation");

router.use(protect, requireApproved);
router.get("/", controller.listNotices);
router.post("/", requireRole("ADMIN"), validate(createNoticeSchema), controller.createNotice);
router.put("/:id", requireRole("ADMIN"), validate(updateNoticeSchema), controller.updateNotice);
router.delete("/:id", requireRole("ADMIN"), validate(noticeIdSchema), controller.deleteNotice);

module.exports = router;
