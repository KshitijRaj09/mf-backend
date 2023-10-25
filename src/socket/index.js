const connectSocketIo = (server, allowedOrigin,onlineUsers) => {
   const io = require('socket.io')(server,
      {
         pingTimeout: 60000,
         cors: {
            origin: allowedOrigin,
         },
      }
   );
   io.on("connection", (socket) => {
      console.log('connected to socket.io', socket.id);
      let userId;
      socket.on('addOnlineUser', ({ socketId, userId: userid }) => {
         onlineUsers[userid] = socketId;
         userId = userid
         console.log('onlineuser', onlineUsers)
      });

      //one-one chat
      let chatId;
      socket.on('one-one-chat', chatid => {
         chatId = chatid;
         console.log('hello', chatId);
         socket.join(chatId);
      });

      socket.on('send-message', (message) => {
         console.log('chatId', chatId)
         const notification = {isRead: false, ...message}
         io.to(onlineUsers[message.receiverId]).emit('message-from-server', (message));
         io.to(onlineUsers[message.receiverId]).emit('send-notification', notification);
      });

      socket.on("start-typing-from-client", () => {
         socket.to(chatId).emit('start-typing-from-server');
      });

      socket.on("stop-typing-from-client", () => {
         socket.to(chatId).emit('stop-typing-from-server');
      })
      
      socket.on("disconnect", (reason) => {
         //console.log('A user disconnected', reason, onlineUsers, socket.id, socket.connected)
         delete onlineUsers[userId];
         console.log('online user after disconnect', onlineUsers);
         
      })
   })
}

module.exports = { connectSocketIo };