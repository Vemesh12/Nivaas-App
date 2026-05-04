const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", protect, controller.me);

module.exports = router;
