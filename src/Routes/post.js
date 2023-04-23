const {
   createPost,
   updatePost,
   deletePost,
   likeDislikePost,
   getPost,
   getTimeLinePost,
} = require("../Controllers/post");
const Router = require("express");
const {verifyAuthToken} = require("../middleware/verifyAuthToken");
const router = Router();

router.post("/", verifyAuthToken, createPost);
router.put("/:id", verifyAuthToken, updatePost);
router.delete("/:id", verifyAuthToken, deletePost);
router.put("/:id/like", verifyAuthToken, likeDislikePost);
router.get("/:id", verifyAuthToken, getPost);
router.get("/timeline/all", verifyAuthToken, getTimeLinePost);

module.exports = router;
