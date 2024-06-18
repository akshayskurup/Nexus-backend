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
exports.deletePost = exports.userSavedPost = exports.userPost = exports.savedPost = exports.reportPost = exports.editPost = exports.likePost = exports.getOnePost = exports.getPost = exports.addPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const postHelper_1 = require("../helpers/postHelper");
const userHelper_1 = require("../helpers/userHelper");
//@desc   Add Post
//@route  /post/add-post
exports.addPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, image, userId } = req.body;
    const newPost = yield (0, postHelper_1.createPost)(description, userId, image);
    if (!newPost) {
        res.status(400);
        throw new Error("Cannot add post");
    }
    const post = yield (0, postHelper_1.getAllPost)();
    res.status(200).json({ message: "Post Uploaded Successfully", post });
}));
//@desc   Get Post
//@route  /post/get-post
exports.getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.user from post", req.user);
    const post = yield (0, postHelper_1.getAllPost)();
    if (!post) {
        res.status(400);
        throw new Error("No post available");
    }
    res.status(200).json({ message: "Fetched all Post successfully", post });
}));
//@desc   Find Post
//@route  /post/find-post
exports.getOnePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Inside getOnePostttt");
    const postId = req.params.postId;
    const post = yield (0, postHelper_1.findPost)(postId);
    if (!post) {
        res.status(400);
        throw new Error("No post available");
    }
    res.status(200).json({ message: "Fetched Post successfully", post });
}));
//@desc   Like Post
//@route  /post/get-post
exports.likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    const post = yield (0, postHelper_1.postLike)(userId, postId);
    if (!post) {
        res.status(400);
        throw new Error("Post not found");
    }
    const posts = yield (0, postHelper_1.getAllPost)();
    console.log("Postss", posts);
    res.status(200).json({ message: "Successfully liked", posts });
}));
//@desc   Edit Post
//@route  /post/update-post
exports.editPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, description } = req.body;
    const post = yield (0, postHelper_1.postEdit)(userId, postId, description);
    if (!post) {
        res.status(400);
        throw new Error("Post not found");
    }
    const posts = yield (0, postHelper_1.getUserPost)(userId);
    res.status(200).json({ message: "Successfully updated", posts });
}));
//@desc   Report Post
//@route  /post/report-post
exports.reportPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, reason } = req.body;
    const Report = yield (0, postHelper_1.report)(userId, postId, reason);
    if (!Report) {
        res.status(400);
        throw new Error("Post not found");
    }
    res.status(200).json({ message: "Reported the post" });
}));
//@desc   Save Post
//@route  /post/save-post
exports.savedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    const user = yield (0, userHelper_1.findById)(userId);
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        res.status(400);
        throw new Error("User is Blocked");
    }
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    const post = yield (0, postHelper_1.findPost)(postId);
    if (post === null || post === void 0 ? void 0 : post.isBlocked) {
        res.status(400);
        throw new Error("This post is unavailable");
    }
    const updatedUser = yield (0, userHelper_1.postSave)(user, postId);
    if (!updatedUser) {
        res.status(400);
        throw new Error("Post didn't save properly");
    }
    res.status(200).json({ message: "Successfully Post Saved", updatedUser });
}));
//@desc   Get User Post
//@route  /post/get-post
exports.userPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield (0, userHelper_1.findById)(userId);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    const posts = yield (0, postHelper_1.getUserPost)(userId);
    res.status(200).json({ message: "Successfully fetched", posts });
}));
//@desc   Get User Saved Post
//@route  /post/get-saved-post
exports.userSavedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield (0, userHelper_1.findById)(userId);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    const savedposts = yield (0, postHelper_1.getSavedPost)(user);
    res.status(200).json({ message: "Successfully fetched", savedposts });
}));
//@desc   Delete Post
//@route  /post/delete-post
exports.deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    console.log("post", postId);
    const post = yield (0, postHelper_1.findPost)(postId);
    if (!post) {
        res.status(400);
        throw new Error("Post not found");
    }
    console.log("Post", post);
    const updatedPost = yield (0, postHelper_1.postDelete)(postId);
    if (!updatedPost) {
        res.status(400);
        throw new Error("Post didn't delete properly");
    }
    console.log(updatedPost);
    res.status(200).json({ message: "Successfully Post Saved", updatedPost });
}));
