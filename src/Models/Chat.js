const mongoose = require("mongoose");
const ChatSchema = mongoose.Schema(
   {
      /*chatName: {
         type: String,
         trim: true,
         default: "",
      },                // future feature
      isGroupChat: {
         type: Boolean,
         default: false,
      },
      groupAdmin: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },*/
      users: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
         },
      ],
      messages: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: true
         }
      ],
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Chat", ChatSchema);
