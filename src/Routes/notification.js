const Router = require("express");
const { verifyAuthToken } = require("../middleware/verifyAuthToken");
const { getNotification, addNotification, updateNotification, deleteNotification } = require("../Controllers/notification");
const router = Router();

router.get('/', verifyAuthToken, getNotification);
router.post('/', verifyAuthToken, addNotification);
router.put('/', verifyAuthToken, updateNotification);
router.delete('/:secondUserId', verifyAuthToken, deleteNotification);

module.exports = router;