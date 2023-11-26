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
      let userId='';
      socket.on('addOnlineUser', ({ socketId, userId: userid }) => {
         console.log('here addonlineuser', userid, socketId);
         onlineUsers = { [userid]: [], ...onlineUsers };
         onlineUsers[userid].push(socketId);
         userId = userid
         console.log('after push new socket id onlineuser', onlineUsers);
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
         const notification = { isRead: false, type: 'message', ...message };
         console.log(onlineUsers[message.receiverId]);
         socket.to(chatId).emit('message-from-server', (message));
         onlineUsers[message.receiverId].forEach((socketId) => 
         io.to(socketId).emit('message-notification', notification))   
      });

      socket.on("start-typing-from-client", () => {
         socket.to(chatId).emit('start-typing-from-server');
      });

      socket.on("stop-typing-from-client", () => {
         socket.to(chatId).emit('stop-typing-from-server');
      })
      
      socket.on("disconnect", (reason) => {
         console.log('A user disconnected', reason, onlineUsers, socket.id, socket.connected)
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