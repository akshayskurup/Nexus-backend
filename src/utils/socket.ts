const socketConfig = (io: any) => {
  let users: { userId: string; socketId: string }[] = [];

  io.on("connect", (socket: any) => {
    console.log(`User connected ${socket.id}`);

    io.emit("welcome", "You are now with socket io...");

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.id}`);
    });

    const addUser = (userId: string, socketId: string) => {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    };
    const removeUser = (socketId: string) => {
      users = users.filter((user) => user.socketId !== socketId);
    };

    socket.on("addUser", (userId: string) => {
      addUser(userId, socket.id);
      console.log("Userss", users);
      io.emit("getUsers", users);
    });

    const getUser = (userId: string) => {
        console.log("getUser userID",userId)
        return users.find((user) => user.userId === userId);
    };
    // send and get message
    socket.on("sendMessage",({senderId,receiverId,text}:{senderId:string,receiverId:string,text:string})=>{
        const user = getUser(receiverId);
        console.log("user rev",user)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text
        });
        console.log("ioTp",senderId,text,user?.socketId)
    })


    //video call
    socket.on("videoCallRequest",(data:any)=>{
      console.log("Received videoCallRequest:", data);
      const emitData = {
        roomId: data.roomId,
        senderName : data.senderName,
        senderProfile: data.senderProfile
      }
      const user = getUser(data.receiverId)
      if(user){
        io.to(user.socketId).emit("VideoCallResponse",emitData);
      }
    })

    socket.on("GroupVideoCall",(data:any)=>{
      const emitData = {
        roomId: data.roomId,
        groupName: data.groupName,
        profile: data.groupProfile
      }
      console.log("Emiting group Video call",emitData)
      io.to(data.groupId).emit("GroupVideoCallResponse",emitData)
    })

    socket.on("AudioCallRequest",(data:any)=>{
      const emitData = {
        roomId: data.roomId,
        senderName : data.senderName,
        senderProfile: data.senderProfile
      }
      const user = getUser(data.receiverId)
      if(user){
        io.to(user.socketId).emit("AudioCallResponse",emitData);
      }
    })

    socket.on("GroupAudioCall",(data:any)=>{
      console.log("Request receivedd",data)
      const {groupId} = data;
      const emitData = {
        roomId: data.roomId,
        groupName: data.groupName,
        profile: data.groupProfile
      }
      io.to(groupId).emit("groupAudioCallResponse",emitData)
      console.log("Emmiteddd successfully",emitData)

    })

    //group chat


    socket.on("joinGroup", (data: any) => {
      try {
        const { groupId, userId } = data;
        socket.join(groupId);
        console.log("Connected to the group", groupId, "by user", userId);
        socket
          .to(groupId)
          .emit("joinGroupResponse", {
            message: "Successfully joined the group",
          });
          console.log("Successfully joined the group")
          console.log("Checking for rooms",socket.rooms);

      } catch (error) {
        console.error("Error occurred while joining group:", error);
      }
    });

    socket.on("sendGroupMessage",(data:any)=>{
      const {groupId,sender,text} = data;
      io.to(groupId).emit("getGroupMessages",data)
      console.log("Emitted groupmess",data)
    })
    
     // When disconnectec
     socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
      });

    // socket.on("chat message", (message: any) => {
    //   console.log(`Received message from client: ${message}`);
    //   socket.broadcast.emit("message_received", message);
    // });
  });
};

export default socketConfig;
