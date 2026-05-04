const router = require("express").Router();
const controller = require("../controllers/community.controller");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");
const { createCommunitySchema, joinCommunitySchema } = require("../validations/community.validation");

router.use(protect);
router.post("/", validate(createCommunitySchema), controller.createCommunity);
router.post("/join", validate(joinCommunitySchema), controller.joinCommunity);
router.get("/my-community", controller.myCommunity);

module.exports = router;
