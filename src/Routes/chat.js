const Router = require("express");
const router = Router();
const {
  createChat,
  getUserChats,
  findChat,
  deleteAllChats
} = require("../Controllers/chat");
const { verifyAuthToken } = require("../middleware/verifyAuthToken");

router.post("/", verifyAuthToken, createChat);
router.get("/getUserChats", verifyAuthToken, getUserChats);
router.post("/find/", verifyAuthToken, findChat);
router.delete("/", verifyAuthToken, deleteAllChats);
//router.post("/groupchat", createGroupChat);
//router.put("/renamegroup", renameGroupChat);
//router.put("/removefromgroup", removeFromGroupChat);
//router.put("/addtogroup", addToGroupChat);

module.exports = router;
