const userRouters = require("./userRouters");
const authUser = require("./authUser");
const followUserRouter = require("./follow");
const postRouter = require("./post");
const chatRouter = require("./chat");
const messageRouter = require("./message");
const notificationRouter = require("./notification");

module.exports = {
   userRouters,
   authUser,
   followUserRouter,
   postRouter,
   chatRouter,
   messageRouter,
   notificationRouter
};
