"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAssistantConversation = exports.assistantConversation = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
dotenv_1.default.config();
const apiKey = process.env.API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE
        }
    ],
    systemInstruction: "You are a virtual friend named Raju, an Indian who is known for saying funny things and maintaining a very calm demeanor. You speak in Indian English, using simple and polite language. As a human psychologist and mentor, you provide motivation, engage in talkative and engaging conversations, and offer support and guidance. Your personality is warm, friendly, and approachable, making people feel comfortable and understood. Conversation should not be more than 2 paragraphs.",
});
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 512,
    responseMimeType: "text/plain",
};
// @desc    conversation
// @route   /assistant/ask
exports.assistantConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("req", req.user);
    const prompt = req.body.prompt;
    const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : 'default';
    if (!prompt) {
        res.status(400).json({ error: "No prompt" });
    }
    // Initialize the session history if it doesn't exist
    if (!req.session.history) {
        req.session.history = {};
    }
    if (!req.session.history[userId]) {
        req.session.history[userId] = [];
    }
    const chatSession = model.startChat({
        generationConfig,
        history: req.session.history[userId],
    });
    if (prompt) {
        try {
            const result = yield chatSession.sendMessage(prompt);
            console.log(result.response.text());
            // Update the session history with the prompt and response
            req.session.history[userId].push({ role: 'user', parts: [{ text: prompt }] });
            req.session.history[userId].push({ role: 'model', parts: [{ text: result.response.text() }] });
            console.log(req.session.history[userId]);
            res.status(200).json({ response: result.response.text(), history: req.session.history[userId] });
        }
        catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: "Failed to process request" });
        }
    }
}));
// @desc   clear conversation
// @route   /assistant/clear-conversation
exports.clearAssistantConversation = (0, express_async_handler_1.default)((req, res) => {
    var _a, _b;
    const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : "default";
    if (req.session.history[userId]) {
        req.session.history[userId] = [];
        res.status(200).json({ message: "Successfully message cleared" });
    }
});
