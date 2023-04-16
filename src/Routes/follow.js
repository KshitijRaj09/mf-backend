const {followUser, unfollowUser} = require("../Controllers/follow");
const Router = require("express");
const router = Router();

router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
