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
exports.fetchAllReportedPost = exports.changeStatus = exports.reportedPostCount = exports.userCount = exports.fetchUserswithPagination = exports.fetchAllUsers = exports.findAdminByEmail = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const findAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminModel_1.default.findOne({ email });
        return admin;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding admin by email: ${error.message}`);
    }
});
exports.findAdminByEmail = findAdminByEmail;
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        if (!users) {
            return null;
        }
        return users;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding all Users: ${error.message}`);
    }
});
exports.fetchAllUsers = fetchAllUsers;
const fetchUserswithPagination = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startIndex = (page - 1) * limit;
        const users = yield userModel_1.default.find().skip(startIndex).limit(limit);
        if (!users) {
            return null;
        }
        return users;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding all Users: ${error.message}`);
    }
});
exports.fetchUserswithPagination = fetchUserswithPagination;
const userCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.countDocuments({});
        if (!users) {
            return null;
        }
        return users;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error while counting: ${error.message}`);
    }
});
exports.userCount = userCount;
const reportedPostCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportCount = yield reportModel_1.default.countDocuments({});
        if (!reportCount) {
            return null;
        }
        return reportCount;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error while counting: ${error.message}`);
    }
});
exports.reportedPostCount = reportedPostCount;
const changeStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { $set: { isBlocked: status } }, { new: true });
        if (!user) {
            return null;
        }
        console.log("User after changing the status", user);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error in changeStatus: ${error.message}`);
    }
});
exports.changeStatus = changeStatus;
const fetchAllReportedPost = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startIndex = (page - 1) * limit;
        const posts = yield reportModel_1.default.find().populate("postId").populate("userId").skip(startIndex).limit(limit);
        ;
        if (!posts) {
            return null;
        }
        return posts;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding all Posts: ${error.message}`);
    }
});
exports.fetchAllReportedPost = fetchAllReportedPost;
