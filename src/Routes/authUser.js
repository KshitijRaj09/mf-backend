const {loginUser, registerUser} = require("../Controllers/authUser");
const Router = require("express");
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
