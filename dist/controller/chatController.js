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
exports.getLastMessage = exports.getMessage = exports.addMessage = exports.findConversationOfTwoUsers = exports.getUserConversation = exports.addConversation = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chatHelper_1 = require("../helpers/chatHelper");
// @desc    Add new conversation
// @route   /chat/add-conversation
exports.addConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.body;
    const existingConversation = yield (0, chatHelper_1.findConversation)(senderId, receiverId);
    if (existingConversation) {
        res.status(200).json(existingConversation);
        return;
    }
    else {
        const conversation = yield (0, chatHelper_1.createConversation)(senderId, receiverId);
        res.status(200).json(conversation);
    }
}));
// @desc    get user conversation
// @route   /chat/get-conversation
exports.getUserConversation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield (0, chatHelper_1.findUserConversation)(req.params.userId);
    if (!conversation) {
        res.status(400);
        throw new Error("Error during finding conversation");
    }
    res.status(200).json(conversation);
}));
// @desc    Find conversations of two users
// @route   /chat/find-conversation
exports.findConversationOfTwoUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield (0, chatHelper_1.getConversationOfTwoUsers)(req.params.firstUserId, req.params.secondUserId);
        if (!conversation) {
            res.json("No conversation");
            return;
        }
        res.status(200).json(conversation);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// @desc    add new message
// @route   /chat/add-message
exports.addMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("message sending");
    console.log(req.body);
    const { conversationId, sender, text } = req.body;
    const newMessage = yield (0, chatHelper_1.addNewMessage)(conversationId, sender, text);
    if (!newMessage) {
        res.status(400);
        throw new Error("Error during adding new message");
    }
    res.status(200).json(newMessage);
}));
// @desc    get user messages
// @route   /chat/get-messages
exports.getMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const newMessage = yield (0, chatHelper_1.fetchMessage)(conversationId);
    if (!newMessage) {
        res.status(400);
        throw new Error("Error during adding new message");
    }
    res.status(200).json(newMessage);
}));
// @desc    get user last messages
// @route   /chat/get-last-messages
exports.getLastMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    console.log("Covmersation", conversationId);
    const lastMessage = yield (0, chatHelper_1.fetchLastMessage)(conversationId);
    if (!lastMessage) {
        res.status(400);
        throw new Error("Error during feting last message");
    }
    // console.log("last message",lastMessage)
    res.status(200).json(lastMessage);
}));
