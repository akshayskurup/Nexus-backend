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
exports.fetchLastMessage = exports.getConversationOfTwoUsers = exports.fetchMessage = exports.addNewMessage = exports.findUserConversation = exports.createConversation = exports.findConversation = void 0;
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const messagesModel_1 = __importDefault(require("../models/messagesModel"));
const findConversation = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingConversation = yield conversationModel_1.default.findOne({
        members: { $all: [senderId, receiverId] },
    }).populate("members");
    if (existingConversation) {
        return existingConversation;
    }
    return null;
});
exports.findConversation = findConversation;
const createConversation = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const newConversation = new conversationModel_1.default({
        members: [senderId, receiverId],
    });
    const savedConversation = yield newConversation.save();
    const conversation = yield conversationModel_1.default.findById(savedConversation._id).populate("members");
    if (conversation) {
        return conversation;
    }
    return null;
});
exports.createConversation = createConversation;
const findUserConversation = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield conversationModel_1.default.find({
            members: { $in: [userId] },
        });
        if (conversation) {
            return conversation;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding conversation: ${error.message}`);
    }
});
exports.findUserConversation = findUserConversation;
const addNewMessage = (conversationId, sender, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = new messagesModel_1.default({
            conversationId,
            sender,
            text,
        });
        yield conversationModel_1.default.findByIdAndUpdate(conversationId, { updatedAt: Date.now() }, { new: true });
        const savedMessage = yield newMessage.save();
        if (savedMessage) {
            return savedMessage;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding conversation: ${error.message}`);
    }
});
exports.addNewMessage = addNewMessage;
const fetchMessage = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messagesModel_1.default.find({
            conversationId: conversationId,
        }).populate("sender");
        if (messages) {
            return messages;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during fetching messages: ${error.message}`);
    }
});
exports.fetchMessage = fetchMessage;
const getConversationOfTwoUsers = (user1, user2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield conversationModel_1.default.findOne({
            members: { $all: [user1, user2] },
        });
        return conversation;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during fetching Conversation of two users: ${error.message}`);
    }
});
exports.getConversationOfTwoUsers = getConversationOfTwoUsers;
const fetchLastMessage = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastMessage = yield messagesModel_1.default.findOne({ conversationId })
            .sort({ createdAt: -1 }) // Sort messages by createdAt field in descending order
            .limit(1);
        if (lastMessage) {
            return lastMessage;
        }
        else {
            console.log("No last messags");
        }
    }
    catch (error) {
    }
});
exports.fetchLastMessage = fetchLastMessage;
