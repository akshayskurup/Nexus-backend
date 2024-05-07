import express from 'express';
import { addConversation, addMessage, findConversationOfTwoUsers, getMessage, getUserConversation } from '../controller/chatController';
const router = express.Router();



router.post("/add-conversation", addConversation);
router.get("/get-conversations/:userId", getUserConversation);
router.get("/find-conversation/:firstUserId/:secondUserId",findConversationOfTwoUsers)

router.post('/add-message',addMessage);
router.get('/get-messages/:conversationId',getMessage);

export default router;
