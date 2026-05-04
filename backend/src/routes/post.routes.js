const router = require("express").Router();
const controller = require("../controllers/post.controller");
const validate = require("../middleware/validate.middleware");
const { protect, requireApproved } = require("../middleware/auth.middleware");
const { listPostsSchema, createPostSchema, updatePostSchema, idParamSchema, commentSchema } = require("../validations/post.validation");

router.use(protect, requireApproved);
router.get("/", validate(listPostsSchema), controller.listPosts);
router.post("/", validate(createPostSchema), controller.createPost);
router.get("/:id", validate(idParamSchema), controller.getPost);
router.put("/:id", validate(updatePostSchema), controller.updatePost);
router.delete("/:id", validate(idParamSchema), controller.deletePost);
router.post("/:id/like", validate(idParamSchema), controller.toggleLike);
router.post("/:id/comments", validate(commentSchema), controller.addComment);

module.exports = router;
