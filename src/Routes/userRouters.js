const {updateUser, deleteUser, getUser} = require("../Controllers/user");
const Router = require("express");
const {verifyAuthToken} = require("../middleware/verifyAuthToken");
const router = Router();

router.put("/:id", verifyAuthToken, updateUser);
router.delete("/:id", verifyAuthToken, deleteUser);
router.get("/:id", verifyAuthToken, getUser);

module.exports = router;
