const User = require("../Models/User");

const connectSocketIo = (server, allowedOrigin, onlineUsers) => {
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
         onlineUsers?.[userid]?.push(socketId);
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
      });

      socket.on("newpost-from-client", async (post) => {
         try {
            const userInfo = await User.findById(post.userId).
               select('followers username avatar name');
            const { followers: currentUserFollowers, username, avatar, name } = userInfo;
            currentUserFollowers?.forEach?.(follower => {
               if (onlineUsers?.[follower.toString()]) {
                  onlineUsers?.[follower.toString()]?.forEach(socketId => {
                     io.to(socketId).emit('newpost-from-server', {
                        ...post, username,
                        avatar, name
                     });
                  })
               }
            })
         } catch (error) {
            console.log(error);
         }
      });

      socket.on("deletepost-from-client", async (post) => {
         try {
            const { postId, userId } = post;
            const userInfo = await User.findById(userId).
               select('followers');
            const { followers: currentUserFollowers } = userInfo;
            currentUserFollowers?.forEach?.(follower => {
               if (onlineUsers?.[follower.toString()]) {
                  onlineUsers?.[follower.toString()]?.forEach(socketId => {
                     io.to(socketId).emit('deletepost-from-server', postId);
                  })
               }
            })
         } catch (error) {
            console.log(error);
         }
      })
      
      socket.on("disconnect", (reason) => {
         onlineUsers[userId] = onlineUsers?.[userId]?.filter(socketId => socketId !== socket.id);
         if (!onlineUsers?.[userId]?.length) {
            delete onlineUsers[userId];
         }
         userId = '';
         console.log('online user after disconnect', onlineUsers, userId);    
      })
   })
}

module.exports = { connectSocketIo };