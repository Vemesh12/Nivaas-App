const router = require("express").Router();
const controller = require("../controllers/user.controller");
const validate = require("../middleware/validate.middleware");
const { protect, requireApproved } = require("../middleware/auth.middleware");
const { updateProfileSchema, privacySchema } = require("../validations/user.validation");

router.use(protect, requireApproved);
router.get("/directory", controller.directory);
router.put("/profile", validate(updateProfileSchema), controller.updateProfile);
router.put("/privacy", validate(privacySchema), controller.updatePrivacy);

module.exports = router;
