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
exports.fetchGroupMessages = exports.addNewGroupMessage = exports.getUserGroups = exports.findGroup = exports.creatingNewGroup = void 0;
const groupChatModel_1 = __importDefault(require("../models/groupChatModel"));
const groupChatModel_2 = __importDefault(require("../models/groupChatModel"));
const groupMessagesModel_1 = __importDefault(require("../models/groupMessagesModel"));
const creatingNewGroup = (name, users, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const newConversation = new groupChatModel_2.default({
        name,
        members: users,
        profile,
    });
    const savedGroupchat = yield newConversation.save();
    const group = (0, exports.findGroup)(savedGroupchat._id);
    if (group) {
        return group;
    }
});
exports.creatingNewGroup = creatingNewGroup;
const findGroup = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield groupChatModel_2.default.find({
        _id: id,
    }).populate("members");
    if (group) {
        return group;
    }
    else {
        return null;
    }
});
exports.findGroup = findGroup;
const getUserGroups = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield groupChatModel_2.default.find({ members: { $in: id } });
        if (group) {
            return group;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during getuserGroup: ${error.message}`);
    }
});
exports.getUserGroups = getUserGroups;
const addNewGroupMessage = (groupId, sender, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = new groupMessagesModel_1.default({
            groupId,
            sender,
            text,
        });
        yield groupChatModel_1.default.findByIdAndUpdate(groupId, { updatedAt: Date.now() }, { new: true });
        const savedMessage = yield newMessage.save();
        if (savedMessage) {
            return savedMessage;
        }
        return null;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during saving group message: ${error.message}`);
    }
});
exports.addNewGroupMessage = addNewGroupMessage;
const fetchGroupMessages = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield groupMessagesModel_1.default.find({
            groupId: groupId
        }).populate("sender");
        console.log("Groupmessages", messages);
        if (messages) {
            return messages;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during fetching messages: ${error.message}`);
    }
});
exports.fetchGroupMessages = fetchGroupMessages;
