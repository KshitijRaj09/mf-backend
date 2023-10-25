const ChatModel = require("../Models/Chat");

const createChat = async (req, res) => {
   const newChat = new ChatModel({
      users: [req.userid, req.body.receiverId],
      messages: [req.messageId]
   });
   try {
      const chat = await newChat.save();
      res.status(200).json(chat);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

const getUserChats = async (req, res) => {
   const userid = req.userid;
   try {
      let chatList = await ChatModel.find({
         users: { $in: [userid] }
      }).populate({
         path: 'users',
         match: { _id: { $ne: userid } }, // select only second user
         select: 'avatar _id name username',
      });

      // to format the users array to simple object
      chatList = chatList.map(chat => {
         const { users, ...rest } = chat.toObject();
         return ({ ...rest, secondUser: users[0] });
      });
      
      res.status(200).json(chatList);
   }
   catch (error) {
      res.status(500).json(error);
   }
};

const findChat = async (req, res) => {
   try {
      const foundChat = await ChatModel.findOne({
         users: { $all: [req.userid, req.body.secondUserId] }
      });
       res.status(200).json(foundChat);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

const deleteAllChats = async (req, res) => {
   try {
      const deleteSuccess = await ChatModel.deleteMany();
      res.status(200).json(deleteSuccess);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

module.exports = {
   getUserChats,
   findChat,
   createChat,
   deleteAllChats
}