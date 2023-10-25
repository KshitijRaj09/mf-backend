const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
   {
      senderId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      receiverId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
      content: {
         type: String,
         trim: true,
      },
      // Chat: {
      //    type: mongoose.Schema.Types.ObjectId,
      //    ref: "Chat"
      // }
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Message", MessageSchema);
