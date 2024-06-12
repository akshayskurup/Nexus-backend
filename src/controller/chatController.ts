import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  addNewMessage,
  createConversation,
  fetchLastMessage,
  fetchMessage,
  findConversation,
  findUserConversation,
  getConversationOfTwoUsers,
} from "../helpers/chatHelper";

// @desc    Add new conversation
// @route   /chat/add-conversation

export const addConversation = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body;
    const existingConversation = await findConversation(senderId, receiverId);
    if (existingConversation) {
      res.status(200).json(existingConversation);
      return;
    } else {
      const conversation = await createConversation(senderId, receiverId);
      res.status(200).json(conversation);
    }
  }
);

// @desc    get user conversation
// @route   /chat/get-conversation

export const getUserConversation = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const conversation = await findUserConversation(req.params.userId);
    if (!conversation) {
      res.status(400);
      throw new Error("Error during finding conversation");
    }
    res.status(200).json(conversation);
  }
);

// @desc    Find conversations of two users
// @route   /chat/find-conversation

export const findConversationOfTwoUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const conversation = await getConversationOfTwoUsers(
        req.params.firstUserId,
        req.params.secondUserId
      );
      if(!conversation){
         res.json("No conversation")
         return
        
      }
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// @desc    add new message
// @route   /chat/add-message

export const addMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log("message sending");
    console.log(req.body);
    const { conversationId, sender, text } = req.body;
    const newMessage = await addNewMessage(conversationId, sender, text);
    if (!newMessage) {
      res.status(400);
      throw new Error("Error during adding new message");
    }
    res.status(200).json(newMessage);
  }
);

// @desc    get user messages
// @route   /chat/get-messages

export const getMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    const newMessage = await fetchMessage(conversationId);
    if (!newMessage) {
      res.status(400);
      throw new Error("Error during adding new message");
    }
    res.status(200).json(newMessage);
  }
);

// @desc    get user last messages
// @route   /chat/get-last-messages

export const getLastMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    console.log("Covmersation",conversationId)
    const lastMessage = await fetchLastMessage(conversationId);
    if (!lastMessage) {
      res.status(400);
      throw new Error("Error during feting last message");
    }
    // console.log("last message",lastMessage)
    res.status(200).json(lastMessage);
  }
);