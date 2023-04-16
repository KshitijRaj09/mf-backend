const {
   createPost,
   updatePost,
   deletePost,
   likeDislikePost,
   getPost,
   getTimeLinePost,
} = require("../Controllers/post");
const Router = require("express");
const router = Router();

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likeDislikePost);
router.get("/:id", getPost);
router.get("/timeline/all", getTimeLinePost);

module.exports = router;
