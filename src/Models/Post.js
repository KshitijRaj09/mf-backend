const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postContent: {
      type: String,
      max: 500,
      required: true,
      trim: true
    },
    image: {
      type: String,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);
