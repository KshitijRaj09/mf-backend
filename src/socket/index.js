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
      let chatId;
      let userId='';
      socket.on('addOnlineUser', ({ socketId, userId: userid }) => {
         onlineUsers = { [userid]: [], ...onlineUsers };
         onlineUsers[userid].push(socketId);
         userId = userid
      });

      //one-one chat
      socket.on('one-one-chat', chatid => {
         socket.leave(chatId);
         chatId = chatid;
         socket.join(chatId);
      });

      socket.on('send-message', (message) => {
         const notification = { isRead: false, type: 'message', ...message };
         socket.to(chatId).emit('message-from-server', (message));
         onlineUsers?.[message.receiverId]?.forEach((socketId) => 
         io.to(socketId).emit('message-notification', notification))   
      });

      socket.on("start-typing-from-client", () => {
         socket.to(chatId).emit('start-typing-from-server');
      });

      socket.on("stop-typing-from-client", () => {
         socket.to(chatId).emit('stop-typing-from-server');
      })
      
      socket.on("disconnect", (reason) => {
         onlineUsers[userId] = onlineUsers[userId].filter(socketId => socketId !== socket.id);
         if (!onlineUsers[userId].length) {
            delete onlineUsers[userId];
         }
         userId = '';
         console.log('online user after disconnect', onlineUsers, userId);    
      })
   })
}

module.exports = { connectSocketIo };