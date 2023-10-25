const User = require("../Models/User");
const bcrypt = require("bcrypt");
const {
  checkIsUserFollowerHelper,
  checkIfValueExist,
  filterDeletedUser,
  updateJWTToken,
} = require("../util");

//update an user
const updateUser = async (req, res) => {
  const { password, username, email } = req.body;
  const bearerToken = req.headers["authorization"].split(" ")[1];
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
    await User.findByIdAndUpdate(req.userid, {
      $set: req.body,
    });

    const user = await User.findById(req.userid);
    const JWTToken = updateJWTToken(bearerToken, user);
    res
      .status(200)
      .json({ token: JWTToken, message: "Account has been updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//delete an user
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

//get an user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userid);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get all userList
const getAllUserList = async (req, res) => {
  try {
    let { allusers, currentUserFollowings } = await checkIsUserFollowerHelper(
      User,
      req
    );
    //const { password, updatedAt, ...other } = user._doc;

    allusers = allusers.map((user) =>
      currentUserFollowings.has(user.userId)
        ? { ...user, isFollowing: true }
        : { ...user, isFollowing: false }
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

//Get by User by search
const getUserBySearch = async (req, res) => {
  console.log(req.query);
  const keyword = req.query.search;
  if (!keyword) {
    res.status(200).json([]);
  }
  try {
    const userList = await User.find({
      $or: [{ name: { $regex: keyword, $options: 'i' } },
      { username: { $regex: keyword, $options: 'i' } }]
    }).where('_id').ne(req.userid).select('username name avatar profilePicture _id')
    console.log(userList);
    return res.status(200).json(userList);
  }
  catch (error) {
    res.status(500).json(error);
  }

};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUserList,
  getUserBySearch
};
