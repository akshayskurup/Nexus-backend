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
exports.commentDelete = exports.replyComment = exports.commentsCount = exports.allComments = exports.myComment = exports.addComment = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const date_fns_1 = require("date-fns");
const commentHelper_1 = require("../helpers/commentHelper");
// @desc    Add Comment
// @route   /post/add-comment
exports.addComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, comment } = req.body;
    const newComment = yield (0, commentHelper_1.createNewComment)(userId, postId, comment);
    if (!newComment) {
        res.status(400);
        throw new Error("Cannot add comment");
    }
    const comments = yield (0, commentHelper_1.getAllComments)(postId);
    res.status(200).json({ message: "Comment Posted Successfully", comments });
}));
// @desc    My Comment
// @route   /post/add-comment
exports.myComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
    const postId = (_b = req.query) === null || _b === void 0 ? void 0 : _b.postId;
    if (!userId || !postId) {
        res.status(400);
        throw new Error("Cannot userId and postId is not available");
    }
    const comment = yield (0, commentHelper_1.getMyComment)(userId, postId);
    res.status(200).json({ message: "Your comment fetched", comment });
}));
// @desc    Get All  Comments
// @route   /post/get-comments
exports.allComments = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const comment = yield (0, commentHelper_1.getAllComments)(postId);
    if (!comment) {
        res.status(400);
        throw new Error("No comments");
    }
    const commentsWithElapsedTime = comment.map(Comment => (Object.assign(Object.assign({}, Comment.toObject()), { elapsed: (0, date_fns_1.formatDistanceToNow)(new Date(Comment.createdAt), { addSuffix: true }) })));
    res.status(200).json({ message: "Comment fetched", comment: commentsWithElapsedTime });
}));
// @desc    Get Comment Count
// @route   /post/get-comments-count
exports.commentsCount = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const totalComment = (yield (0, commentHelper_1.getAllComments)(postId)).length;
    res.status(200).json({ message: "Comment fetched", totalComment });
}));
// @desc    Reply Comment
// @route   /post/reply-comment
exports.replyComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, commentId, reply } = req.body;
    const comment = yield (0, commentHelper_1.findComment)(commentId);
    if (!comment) {
        res.status(400);
        throw new Error("Comment not found");
    }
    const newReply = {
        userId,
        reply,
        timeStamp: new Date()
    };
    const Reply = yield (0, commentHelper_1.addReply)(comment, newReply);
    if (!Reply) {
        res.status(400);
        throw new Error("Can't reply at this moment !");
    }
    res.status(200).json({ message: "Reply comment added " });
}));
// @desc    Delete Comment
// @route   /post/delete-comment
exports.commentDelete = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.body;
    console.log("commentId", req.body);
    const comment = yield (0, commentHelper_1.deleteComment)(commentId);
    if (!comment) {
        res.status(400);
        throw new Error("No comments");
    }
    const comments = yield (0, commentHelper_1.getAllComments)(comment.postId);
    res.status(200).json({ message: "Comment fetched", comments });
}));
