import groupChat from "../models/groupChatModel";
import GroupChat from "../models/groupChatModel";
import groupMessage from "../models/groupMessagesModel";

export const creatingNewGroup = async (name: any, users: any, profile: any) => {
  const newConversation = new GroupChat({
    name,
    members: users,
    profile,
  });
  const savedGroupchat = await newConversation.save();
  const group = findGroup(savedGroupchat._id);
  if(group){
    return group
  }
};

export const findGroup = async (id: any) => {
  const group = await GroupChat.find({
    _id: id,
  }).populate("members");
  if (group) {
    return group;
  } else {
    return null;
  }
};

export const getUserGroups = async(id:string)=>{
    try {
        const group = await GroupChat.find({ members: { $in: id } });
        if(group){
            return group
        }
    } catch (error:any) {
        console.log(error);
        throw new Error(`Error during getuserGroup: ${error.message}`);
    }
    
}

export const addNewGroupMessage = async(groupId:string,sender:string,text:string)=>{
  try {
    const newMessage = new groupMessage({
      groupId,
      sender,
      text,
    });
    await groupChat.findByIdAndUpdate(
      groupId,
      { updatedAt: Date.now() },
      { new: true }
    );
    const savedMessage = await newMessage.save();

    if (savedMessage) {
      return savedMessage;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error during saving group message: ${error.message}`);
  }
  
}


export const fetchGroupMessages = async(groupId:string)=>{
  try {
    const messages = await groupMessage.find({
      groupId:groupId
    }).populate("sender");
    console.log("Groupmessages",messages)
    if(messages){
      return messages
    }
  } catch (error:any) {
    console.log(error);
    throw new Error(`Error during fetching messages: ${error.message}`);
  }
  
}