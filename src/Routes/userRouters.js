const {updateUser, deleteUser, getUser} = require("../Controllers/user");
const Router = require("express");
const router = Router();

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);

module.exports = router;
