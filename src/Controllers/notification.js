const notificationModel = require('../Models/Notification');

const getNotification = async (req, res) => {
   const userId = req.userid;
   try {
      const notifications = await notificationModel.find({ receiverId: userId });
      res.status(200).json(notifications);
   }
   catch (error) {
      res.status(500).json(error);
   }  
}

const addNotification = async (req, res) => {
   const userId = req.userid;
   try {
      const { content, receiverId,
         isRead = false, type: notificationType } = req.body;
      
         const newNotification = new notificationModel({
            content,
            senderId: userId,
            receiverId,
            notificationType,
            isRead
         });
      const notification = await newNotification.save();
      res.status(200).json(notification);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

const updateNotification = async (req, res) => {
   const { _id } = req.body;
   try {
      const notification = await notificationModel.updateOne({ _id }, {
         $set: {
            isRead: true
         }
      });
      res.status(200).json(notification);
   }
   catch (error) {
      res.status(500).json(error);
   }
};

const deleteNotification = async (req, res) => {
   const userId = req.userid;
   const { secondUserId } = req.params;
   try {
      const notification = await notificationModel.deleteMany({
         $and: [
            { receiverId: userId },
            { senderId: secondUserId }
         ]
      });
      res.status(200).json(notification);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

module.exports = {
   getNotification,
   addNotification,
   updateNotification,
   deleteNotification
}