const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
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
      isRead: {
         type: Boolean,
         default: false
      },
      notificationType: {
         type: String,
         enum: ['message', 'post', 'like'],
      }
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Notification", NotificationSchema);
