const User = require("../Models/User");
const bcrypt = require("bcrypt");

//REGISTER
const registerUser = async (req, res) => {
   console.log("hello here", req.body);
   try {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
         username: req.body.username,
         email: req.body.email,
         password: hashedPassword,
         name: req.body.name,
      });

      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
   } catch (err) {
      console.log("error", err);
      res.status(500).json(err);
   }
};

//LOGIN
const loginUser = async (req, res) => {
   try {
      const user = await User.findOne({email: req.body.email});
      !user && res.status(404).json("user not found");

      const validPassword = await bcrypt.compare(
         req.body.password,
         user.password
      );
      !validPassword && res.status(400).json("wrong password");

      res.status(200).json(user);
   } catch (err) {
      res.status(500).json(err);
   }
};

module.exports = {
   registerUser,
   loginUser,
};
