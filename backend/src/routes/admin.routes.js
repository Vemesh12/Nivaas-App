const router = require("express").Router();
const controller = require("../controllers/admin.controller");
const validate = require("../middleware/validate.middleware");
const requireRole = require("../middleware/role.middleware");
const { protect, requireApproved } = require("../middleware/auth.middleware");
const { idParamSchema } = require("../validations/post.validation");

router.use(protect, requireApproved, requireRole("ADMIN"));
router.get("/dashboard", controller.dashboard);
router.get("/pending-residents", controller.pendingResidents);
router.put("/users/:id/approve", validate(idParamSchema), controller.approveUser);
router.put("/users/:id/reject", validate(idParamSchema), controller.rejectUser);
router.delete("/users/:id", validate(idParamSchema), controller.removeUser);
router.put("/posts/:id/pin", validate(idParamSchema), controller.pinPost);
router.delete("/posts/:id", validate(idParamSchema), controller.deletePost);

module.exports = router;
