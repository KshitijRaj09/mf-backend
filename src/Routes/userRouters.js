const {
   updateUser,
   deleteUser,
   getUser,
   getAllUserList,
   getUserBySearch,
} = require("../Controllers/user");
const Router = require("express");
const {verifyAuthToken} = require("../middleware/verifyAuthToken");
const router = Router();

router.put("/update", verifyAuthToken, updateUser);
router.delete("/:userid", verifyAuthToken, deleteUser);
router.get("/getUserDetails", verifyAuthToken, getUser);
router.get("/all/allUsers", verifyAuthToken, getAllUserList);
router.get("/getUserBySearch", verifyAuthToken, getUserBySearch);

module.exports = router;
