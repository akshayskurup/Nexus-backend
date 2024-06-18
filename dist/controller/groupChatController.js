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
exports.getGroupMessage = exports.addGroupMessage = exports.getGroups = exports.addGroup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const groupChatHelper_1 = require("../helpers/groupChatHelper");
// @desc    Create new group
// @route   /chat/add-group
exports.addGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, users, profile } = req.body;
    console.log("addGroup", req.body);
    const newGroupConversation = yield (0, groupChatHelper_1.creatingNewGroup)(name, users, profile);
    if (!newGroupConversation) {
        res.status(400);
        throw new Error("Cannot add new Group");
    }
    res.status(200).json({ message: "Group created", newGroupConversation });
}));
// @desc    get groups
// @route   /chat/get-groups
exports.getGroups = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const groups = yield (0, groupChatHelper_1.getUserGroups)(userId);
    if (!groups) {
        res.status(400);
        throw new Error("No Group available");
    }
    res.status(200).json({ message: "Groups fetched", groups });
}));
// @desc    add message group
// @route   /chat/add-group-message
exports.addGroupMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, sender, text } = req.body;
    console.log("text", req.body);
    const newMessage = yield (0, groupChatHelper_1.addNewGroupMessage)(groupId, sender, text);
    if (!newMessage) {
        res.status(400);
        throw new Error("Error during saving message");
    }
    res.status(200).json(newMessage);
}));
// @desc    get group messages
// @route   /chat/get-group-messages
exports.getGroupMessage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    console.log("text", groupId);
    const messages = yield (0, groupChatHelper_1.fetchGroupMessages)(groupId);
    if (!messages) {
        res.json("No group messages");
        return;
    }
    res.status(200).json(messages);
}));
