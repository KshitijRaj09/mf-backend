const User = require("../Models/User");
const bcrypt = require("bcrypt");
const {checkIsUserFollowerHelper} = require("../util");

//update user
const updateUser = async (req, res) => {
   if (req.userid === req.params.userid || req.body.isAdmin) {
      if (req.body.password) {
         try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
         } catch (err) {
            return res.status(500).json(err);
         }
      }
      try {
         const user = await User.findByIdAndUpdate(req.params.userid, {
            $set: req.body,
         });
         res.status(200).json("Account has been updated");
      } catch (err) {
         return res.status(500).json(err);
      }
   } else {
      return res.status(403).json("You can update only your account!");
   }
};

//delete user
const deleteUser = async (req, res) => {
   console.log(req.isAdmin);
   if (req.body.userId === req.params.userid || req.isAdmin) {
      try {
         await User.findByIdAndDelete(req.params.userid);
         res.status(200).json("Account has been deleted");
      } catch (err) {
         return res.status(500).json(err);
      }
   } else {
      return res.status(403).json("You can delete only your account!");
   }
};

//get a user
const getUser = async (req, res) => {
   try {
      const user = await User.findById(req.params.userid);
      const {password, updatedAt, ...other} = user._doc;
      res.status(200).json(other);
   } catch (err) {
      res.status(500).json(err);
   }
};

const getAllUserList = async (req, res) => {
   try {
      let {allusers, currentUserFollowings} = await checkIsUserFollowerHelper(
         User,
         req
      );
      //const { password, updatedAt, ...other } = user._doc;

      allusers = allusers.map((user) =>
         currentUserFollowings.has(user.userId)
            ? {...user, isFollowing: true}
            : {...user, isFollowing: false}
      );
      /*
      follow: boolean, username, description, avatar, userId
      */

      res.status(200).json(allusers);
   } catch (err) {
      res.status(500).json(err);
   }
};

module.exports = {
   updateUser,
   deleteUser,
   getUser,
   getAllUserList,
};
