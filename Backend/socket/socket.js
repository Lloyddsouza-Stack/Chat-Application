const Message=require("../models/Message")
const User= require("../models/User")

const onlineUsers= new Map();

module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      socket.on("join_room", (room) => {
        console.log(`Received join_room event with room: ${room}`);
        if (!room) {
          console.log("No room name provided!");
          return;
        }
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });
      
  
      socket.on("send_message", async (data) => {
        const {senderId, room, content}= data;
        const message= new Message({sender: senderId, content, room});
        await message.save();

        const populatedMessage= await message.populate("sender","username")

        io.to(room).emit("receive_message", populatedMessage);
      });

      socket.on("user_online", (userId)=>{
        if(!onlineUsers.has(userId)){
          onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id)
        io.emit("update_online_users", Array.from(onlineUsers.keys()));
      });
      
      socket.on("typing", ({ userId, room }) => {
        io.to(room).emit("user_typing", { userId, isTyping: true });
      });
  
      socket.on("stop_typing", ({ userId, room }) => {
        io.to(room).emit("user_typing", { userId, isTyping: false });
      });

      socket.on("mark_message_read", async ({ messageId, room }) => {
        try {
            const message = await Message.findById(messageId);
            if (message) {
                message.read = true;
                await message.save();
                io.to(room).emit("message_read", { messageId }); // Notify all users in the room
            }
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
      });

      socket.on("mark_room_read", async ({ userId, room }) => {
        try {
            // Find the latest unread message before marking all as read
            const latestUnreadMessage = await Message.findOne({ room, read: false }).sort({ createdAt: -1 });
    
            // Mark all unread messages in the room as read
            await Message.updateMany({ room, read: false }, { $set: { read: true } });
    
            if (latestUnreadMessage) {
                // Notify the sender that their message was seen
                io.to(latestUnreadMessage.sender.toString()).emit("message_seen", {
                    room,
                    reader: userId
                });
            }
    
            // Notify all users in the room that messages are now read
            io.to(room).emit("room_read", { room });
        } catch (error) {
            console.error("Error marking room as read:", error);
        }
      });

    socket.on("delete_message", async ({ messageId, room }) => {
      try {
          const message = await Message.findById(messageId);
  
          if (!message) return;
  
          // Ensure only the sender can delete the message
          if (message.sender.toString() !== socket.userId) {
              return;
          }
  
          await Message.findByIdAndDelete(messageId);
  
          // Notify all users in the room that a message was deleted
          io.to(room).emit("message_deleted", { messageId });
      } catch (error) {
          console.error("Error deleting message:", error);
      }
    });
    
    socket.on("send_private_message", async ({ senderId, receiverId, content }) => {// for private 1-1 messages
      const privateRoom = [senderId, receiverId].sort().join("_"); // Generate unique private room ID
      socket.join(privateRoom);
  
      const message = new Message({ sender: senderId, content, room: privateRoom });
      await message.save();
      const populatedMessage = await message.populate("sender", "username");
  
      io.to(privateRoom).emit("receive_private_message", populatedMessage);
    });
  

      socket.on("disconnect", () => {
        let userId;
        for(let [id, sockets] of onlineUsers.entries()){
          if(sockets.has(socket.id)){
            userId=id;
            sockets.delete(socket.id);
            if(sockets.size==0){
              onlineUsers.delete(userId)
            }
            break;
          }
        }
        io.emit("update_online_users", Array.from(onlineUsers.keys()));
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };
  