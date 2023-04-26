const {
   followUser,
   unfollowUser,
   getRecommendedUserList,
} = require("../Controllers/follow");
const Router = require("express");
const {verifyAuthToken} = require("../middleware/verifyAuthToken");
const router = Router();

router.put("/followuser/:userid", verifyAuthToken, followUser);
router.put("/unfollowuser/:userid", verifyAuthToken, unfollowUser);
router.get("/getRecommendedUserList", verifyAuthToken, getRecommendedUserList);

module.exports = router;
