const User = require("../Models/User");
const bcrypt = require("bcrypt");
const {
   checkIsUserFollowerHelper,
   checkIfValueExist,
   filterDeletedUser,
} = require("../util");

//update user
const updateUser = async (req, res) => {
   const {password, username, email} = req.body;
   if (password) {
      try {
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
         return res.status(500).json(err);
      }
   }
   try {
      const isUserNameExist = await checkIfValueExist(
         User,
         username,
         "username",
         req.userid
      );
      if (isUserNameExist) {
         return res.status(500).json("Updated username already exists");
      }
      const isEmailExist = await checkIfValueExist(
         User,
         email,
         "email",
         req.userid
      );

      if (isEmailExist) {
         return res.status(500).json("Updated email already exists");
      }
      const user = await User.findByIdAndUpdate(req.userid, {
         $set: req.body,
      });
      console.log({user});
      res.status(200).json("Account has been updated");
   } catch (err) {
      return res.status(500).json(err);
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
      console.log("req");
      const user = await User.findById(req.userid);
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

      allusers = filterDeletedUser(allusers);
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
