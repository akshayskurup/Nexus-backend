import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { addNewGroupMessage, creatingNewGroup, fetchGroupMessages, getUserGroups } from "../helpers/groupChatHelper";

// @desc    Create new group
// @route   /chat/add-group

export const addGroup = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {name,users,profile} = req.body
    console.log("addGroup",req.body)
    const newGroupConversation = await creatingNewGroup(name,users,profile);
    if(!newGroupConversation){
        res.status(400)
        throw new Error("Cannot add new Group");
    }
    res.status(200).json({message:"Group created",newGroupConversation})
})

// @desc    get groups
// @route   /chat/get-groups

export const getGroups = expressAsyncHandler(async(req:Request,res:Response)=>{
    const userId = req.params.userId
    const groups = await getUserGroups(userId);
    if(!groups){
        res.status(400)
        throw new Error("No Group available");
    }
    res.status(200).json({message:"Groups fetched",groups});
})

// @desc    add message group
// @route   /chat/add-group-message

export const addGroupMessage = expressAsyncHandler(async(req:Request,res:Response)=>{
    const { groupId, sender, text } = req.body;
    console.log("text",req.body)
    const newMessage = await addNewGroupMessage(groupId,sender,text);
    if(!newMessage){
        res.status(400)
        throw new Error("Error during saving message");
    }
    res.status(200).json(newMessage);
})

// @desc    get group messages
// @route   /chat/get-group-messages

export const getGroupMessage = expressAsyncHandler(async(req:Request,res:Response)=>{
    const groupId = req.params.groupId;
    console.log("text",groupId)
    const messages = await fetchGroupMessages(groupId);
    if(!messages){
        res.json("No group messages")
         return
    }
    res.status(200).json(messages);
})