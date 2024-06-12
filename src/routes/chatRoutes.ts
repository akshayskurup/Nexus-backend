import express from "express";
import {
  addConversation,
  addMessage,
  findConversationOfTwoUsers,
  getLastMessage,
  getMessage,
  getUserConversation,
} from "../controller/chatController";
import { addGroup, addGroupMessage, getGroupMessage, getGroups } from "../controller/groupChatController";
const router = express.Router();

router.post("/add-conversation", addConversation);
router.get("/get-conversations/:userId", getUserConversation);
router.get("/find-conversation/:firstUserId/:secondUserId",findConversationOfTwoUsers);

router.post("/add-message", addMessage);
router.get("/get-messages/:conversationId", getMessage);
router.get('/get-last-messages/:conversationId',getLastMessage)

router.post("/add-group", addGroup);
router.get("/get-groups/:userId", getGroups);
router.post("/add-group-message",addGroupMessage);

router.get("/get-group-messages/:groupId",getGroupMessage)


export default router;
