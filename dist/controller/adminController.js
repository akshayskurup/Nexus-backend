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
exports.changeReportPostStatus = exports.getAllPosts = exports.changeUserStatus = exports.getAllUsers = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminHelper_1 = require("../helpers/adminHelper");
const generateToken_1 = require("../utils/generateToken");
const postHelper_1 = require("../helpers/postHelper");
// @desc    Admin Login
// @route   /admin/login
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield (0, adminHelper_1.findAdminByEmail)(email);
    if (!admin) {
        throw new Error("Admin not found");
    }
    if (password !== admin.password) {
        res.status(400);
        throw new Error('Invalid password');
    }
    res.status(200).json({
        message: "Login Successful",
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: (0, generateToken_1.generateToken)(admin._id, "admin"),
    });
}));
// @desc    Get Users
// @route   /admin/all-users
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const allUsers = yield (0, adminHelper_1.fetchUserswithPagination)(page, limit);
    const totalUsers = yield (0, adminHelper_1.userCount)();
    if (!allUsers || allUsers.length === 0) {
        res.status(400);
        throw new Error("No user found");
    }
    res.status(200).json({ message: "Successfully fetched all users", allUsers, totalUsers });
}));
// @desc    Block/Unblock Users
// @route   /admin/change-user-status
exports.changeUserStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = req.body;
    const user = yield (0, adminHelper_1.changeStatus)(userId, status);
    if (!user) {
        res.status(400);
        throw new Error("No user found");
    }
    res.status(200).json({ message: "Successfully Updated", users: yield (0, adminHelper_1.fetchAllUsers)(), updatedUser: user });
}));
// @desc    Get Posts
// @route   /admin/all-posts
exports.getAllPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    console.log("pageee", page);
    const allPosts = yield (0, adminHelper_1.fetchAllReportedPost)(page, limit);
    const totalReportedPost = yield (0, adminHelper_1.reportedPostCount)();
    console.log("Reported", totalReportedPost);
    if (!allPosts) {
        res.status(400);
        throw new Error("No posts");
    }
    res.status(200).json({ message: "Successfully fetched all the post", allPosts, totalReportedPost });
}));
// @desc    Block/Unblock Post
// @route   /admin/change-post-status
exports.changeReportPostStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, status } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const post = yield (0, postHelper_1.changePostStatus)(postId, status);
    if (!post) {
        res.status(400);
        throw new Error("No post found");
    }
    res.status(200).json({ message: "Successfully Updated", post: yield (0, adminHelper_1.fetchAllReportedPost)(page, limit) });
}));
