const { getMessages, addMessage, deleteAllMessages } = require("../Controllers/message");
const Router = require("express");
const { verifyAuthToken } = require("../middleware/verifyAuthToken");
const router = Router();

router.post("/", verifyAuthToken, addMessage);
router.get("/:chatId", verifyAuthToken, getMessages);
router.delete("/", verifyAuthToken, deleteAllMessages);

module.exports = router;
