const {followUser, unfollowUser} = require("../Controllers/follow");
const Router = require("express");
const {verifyAuthToken} = require("../middleware/verifyAuthToken");
const router = Router();

router.put("/:id/follow", verifyAuthToken, followUser);
router.put("/:id/unfollow", verifyAuthToken, unfollowUser);

module.exports = router;
