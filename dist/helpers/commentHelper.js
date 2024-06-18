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
exports.addReply = exports.findComment = exports.deleteComment = exports.getMyComment = exports.getAllComments = exports.createNewComment = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postHelper_1 = require("./postHelper");
const createNewComment = (userId, postId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("createNEwComment", userId);
        const post = yield (0, postHelper_1.findPost)(postId);
        if (post === null || post === void 0 ? void 0 : post.isBlocked) {
            return null;
        }
        const newComment = yield commentModel_1.default.create({
            userId,
            postId,
            comment
        });
        return newComment;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during creating comment: ${error.message}`);
    }
});
exports.createNewComment = createNewComment;
const getAllComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield commentModel_1.default.find({ postId: postId, isDeleted: false })
            .populate("userId")
            .populate("replies.userId");
        return comments;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during retreiving comments: ${error.message}`);
    }
});
exports.getAllComments = getAllComments;
const getMyComment = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myComment = yield commentModel_1.default.findOne({ userId: userId, postId: postId, isDeleted: false })
            .sort({ _id: -1 });
        return myComment === null || myComment === void 0 ? void 0 : myComment.comment;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during retreiving my comments: ${error.message}`);
    }
});
exports.getMyComment = getMyComment;
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (comment) {
            comment.isDeleted = true;
            yield comment.save();
            console.log(comment);
            return comment;
        }
        console.log("commentId", commentId);
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during deletingcomments: ${error.message}`);
    }
});
exports.deleteComment = deleteComment;
const findComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            return null;
        }
        return comment;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during finding comments: ${error.message}`);
    }
});
exports.findComment = findComment;
const addReply = (comment, newComment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        comment.replies.push(newComment);
        const replyComment = yield comment.save();
        return replyComment;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during retreiving comments: ${error.message}`);
    }
});
exports.addReply = addReply;
