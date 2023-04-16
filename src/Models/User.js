const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         min: 4,
         max: 20,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
         min: 6,
         max: 15,
      },
      profilePicture: {
         type: String,
         default: "",
      },
      followers: {
         type: Array,
         default: [],
      },
      followings: {
         type: Array,
         default: [],
      },
      isAdmin: {
         type: Boolean,
         default: false,
      },
      description: {
         type: String,
         max: 200,
      },
   },
   {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
