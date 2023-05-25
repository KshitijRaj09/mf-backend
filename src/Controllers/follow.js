const User = require("../Models/User");
const {filterDeletedUser} = require("../util");

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
   if (currentUserId !== userId) {
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

const getRecommendedUserList = async (req, res) => {
   try {
      let users = await User.find({});
      users = users
         .map((user) => ({
            userId: user._id.toString(),
            avatar: user.avatar,
            username: user.username,
            userDescription: user.description,
         }))
         .filter((user) => req.userid !== user.userId);

      let {followings: currentUserFollowings} = await User.findById(
         req.userid
      ).select({
         followings: 1,
         _id: 0,
      });

      currentUserFollowings = currentUserFollowings.map((user) =>
         user.toString()
      );

      currentUserFollowings = new Set(currentUserFollowings);

      users = users
         .filter((user) => !currentUserFollowings.has(user.userId))
         .slice(0, 5);

      users = filterDeletedUser(users);

      res.status(200).json(users);
   } catch (err) {
      res.status(500).json(err);
   }
};

const getFollowingUsersList = async (req, res) => {
   try {
      const userDetails = await User.findById(req.userid);

      let followinguserDetails = await Promise.all(
         userDetails.followings.map((followingsId) =>
            User.findById(followingsId)
         )
      );

      followinguserDetails = filterDeletedUser(followinguserDetails);

      return res.status(200).json(followinguserDetails);
   } catch (error) {
      res.status(500).json(error);
   }
};

module.exports = {
   followUser,
   unfollowUser,
   getRecommendedUserList,
   getFollowingUsersList,
};
