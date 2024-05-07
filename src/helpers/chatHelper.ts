import Conversation from "../models/conversationModel";
import Message from "../models/messagesModel";

export const findConversation = async (senderId: any, receiverId: any) => {
  const existingConversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate("members");
  if (existingConversation) {
    return existingConversation;
  }
  return null;
};

export const createConversation = async (senderId: any, receiverId: any) => {
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });
  const savedConversation = await newConversation.save();
  const conversation = await Conversation.findById(
    savedConversation._id
  ).populate("members");
  if (conversation) {
    return conversation;
  }
  return null;
};

export const findUserConversation = async (userId: any) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    if (conversation) {
      return conversation;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error finding conversation: ${error.message}`);
  }
};

export const addNewMessage = async (
  conversationId: any,
  sender: any,
  text: any
) => {
  try {
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });
    await Conversation.findByIdAndUpdate(
      conversationId,
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
    throw new Error(`Error finding conversation: ${error.message}`);
  }
};

export const fetchMessage = async (conversationId: any) => {
  try {
    const messages = await Message.find({
      conversationId: conversationId,
    }).populate("sender");
    if (messages) {
      return messages;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Error during fetching messages: ${error.message}`);
  }
};

export const getConversationOfTwoUsers = async (user1: string, user2: string) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [user1, user2] },
    });
    return conversation;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      `Error during fetching Conversation of two users: ${error.message}`
    );
  }
};
