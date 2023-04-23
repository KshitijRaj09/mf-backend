const User = require("../Models/User");

//follow a user
const followUser = async (req, res) => {
   const currentUserId = req.userid;
   const userId = req.params.userid;
   if (currentUserId !== userId) {
      try {
         const user = await User.findById(userId);
         const currentUser = await User.findById(currentUserId);
         if (!user.followers.includes(currentUserId)) {
            await user.updateOne({$push: {followers: currentUser}});
            await currentUser.updateOne({$push: {followings: userId}});
            res.status(200).json("User has been followed");
         } else {
            res.status(403).json("You already follow this user");
         }
      } catch (err) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json("You cannot follow yourself");
   }
};

//unfollow a user
const unfollowUser = async (req, res) => {
   const currentUserId = req.userid;
   const userId = req.params.userid;
   if (req.body.userId !== req.id) {
      try {
         const user = await User.findById(userId);
         const currentUser = await User.findById(currentUserId);
         if (user.followers.includes(currentUserId)) {
            await user.updateOne({$pull: {followers: currentUserId}});
            await currentUser.updateOne({$pull: {followings: userId}});
            res.status(200).json("user has been unfollowed");
         } else {
            res.status(403).json("you  follow this user");
         }
      } catch (err) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json("you cant unfollow yourself");
   }
};

module.exports = {
   followUser,
   unfollowUser,
};
