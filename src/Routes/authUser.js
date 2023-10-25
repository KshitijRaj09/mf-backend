const {loginUser, registerUser, deleteManyUser} = require("../Controllers/authUser");
const Router = require("express");
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
//router.delete('/deleteAllUser', deleteManyUser);

module.exports = router;
