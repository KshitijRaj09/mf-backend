const MessageModel = require("../Models/Message");
const ChatModel = require("../Models/Chat");

const addMessage = async (req, res) => {
   try {
      const { content, receiverId } = req.body;
      const newMessage = new MessageModel({
         content,
         senderId: req.userid,
         receiverId
      });
      
      let messageResponse = await newMessage.save();
      messageResponse = messageResponse.toObject();

      let chat = await ChatModel.findOne({
         users: { $all: [req.userid, receiverId] }
      })

      if (chat) {
        await ChatModel.updateOne({_id: chat._id},
            { $push: { "messages": messageResponse._id } },
            { runValidators: true }).select('_id');
      }
      if(!chat){
         const newChat = new ChatModel({
            users: [req.userid, req.body.receiverId],
            messages: [messageResponse._id]
         });
         chat = await newChat.save();
      }

      messageResponse.chatId = chat._id;
      
      res.status(200).json(messageResponse);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

const getMessages = async (req, res) => {
   try {
      const { chatId } = req.params;
      const chatIds = await ChatModel.findById(chatId).select('messages');
      const messagesList = await MessageModel.find({ _id: { $in: chatIds.messages } });
      res.status(200).json(messagesList);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

const deleteAllMessages = async (req, res) => {
   try {
      const deleteSuccess = await MessageModel.deleteMany();
      res.status(200).json(deleteSuccess);
   }
   catch (error) {
      res.status(500).json(error);
   }
}

module.exports = {
   addMessage,
   getMessages,
   deleteAllMessages
}