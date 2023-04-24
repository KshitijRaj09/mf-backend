const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {check} = require("express-validator");

//REGISTER
const registerUser = async (req, res) => {
   console.log("hello here", req.body);
   try {
      const {email, name, password, username} = req.body;
      const listOfUser = await User.find({});
      const existingUser = listOfUser.find(
         (user) => user.email === email || user.username === username
      );
      if (existingUser) {
         return res.status(409).json({
            errormessage: `email: ${existingUser.email} or username: ${existingUser.username} already exists`,
         });
      }
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //create new user
      const newUser = new User({
         username: req.body.username,
         email: req.body.email,
         password: hashedPassword,
         name: req.body.name,
      });

      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user.username);
   } catch (err) {
      console.log("error", err);
      res.status(500).json(err);
   }
};

//LOGIN
const loginUser = async (req, res) => {
   try {
      const user = await User.findOne({email: req.body.email});
      if (!user) return res.status(404).json("user not found");

      const validPassword = await bcrypt.compare(
         req.body.password,
         user.password
      );
      if (!validPassword) return res.status(400).json("wrong password");
      const userDetails = {
         username: user.username,
         name: user.name,
         email: user.email,
         userid: user._id,
      };
      const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY, {
         expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
      });

      userDetails.userToken = token;
      return res.status(200).json(userDetails);
   } catch (err) {
      return res.status(500).json(err);
   }
};

module.exports = {
   registerUser,
   loginUser,
};