import express from "express";
import { assistantConversation, clearAssistantConversation } from "../controller/assistantController";
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

router.post('/ask',verifyToken,assistantConversation)
router.post('/clear',verifyToken,clearAssistantConversation)

export default router;