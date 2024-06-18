"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assistantController_1 = require("../controller/assistantController");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post('/ask', verifyToken_1.verifyToken, assistantController_1.assistantConversation);
router.post('/clear', verifyToken_1.verifyToken, assistantController_1.clearAssistantConversation);
exports.default = router;
