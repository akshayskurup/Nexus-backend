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
exports.getUserSuggestion = exports.allUsers = exports.searchUser = exports.postSave = exports.findUsername = exports.update = exports.findById = exports.findByEmail = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const connectionModel_1 = __importDefault(require("../models/connectionModel"));
const registerUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.session.userDetails;
        const newUser = new userModel_1.default({
            name: userData === null || userData === void 0 ? void 0 : userData.name,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            password: userData === null || userData === void 0 ? void 0 : userData.password
        });
        const NewUser = yield newUser.save();
        yield connectionModel_1.default.create({
            userId: NewUser._id,
        });
        return newUser;
    }
    catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
});
exports.registerUser = registerUser;
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ email });
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding user by email: ${error.message}`);
    }
});
exports.findByEmail = findByEmail;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(id);
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error finding user by email: ${error.message}`);
    }
});
exports.findById = findById;
const update = (userId, updateField) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updateField", updateField);
    try {
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { $set: updateField }, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
});
exports.update = update;
const findUsername = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ userName });
        console.log("findUSerame", user);
        if (user) {
            return user;
        }
        return null;
    }
    catch (error) {
        throw new Error(`Error finding user: ${error.message}`);
    }
});
exports.findUsername = findUsername;
const postSave = (user, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSaved = user.savedPost.includes(postId);
        if (isSaved) {
            const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: user._id }, { $pull: { savedPost: postId } }, { new: true });
            return updatedUser;
        }
        else {
            const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: user._id }, { $push: { savedPost: postId } }, { new: true });
            return updatedUser;
        }
    }
    catch (error) {
        throw new Error(`Error in savepost: ${error.message}`);
    }
});
exports.postSave = postSave;
const searchUser = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({ userName: { $regex: `^${search}`, $options: 'i' } });
        return users;
    }
    catch (error) {
        throw new Error('Error searching users');
    }
});
exports.searchUser = searchUser;
const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.default.find({});
        return allUsers;
    }
    catch (error) {
        throw new Error('Error getting users');
    }
});
exports.allUsers = allUsers;
const getUserSuggestion = (followingIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersExceptFollowed = yield userModel_1.default.find({
            _id: { $nin: followingIds }, // Exclude users already followed
            userName: { $exists: true } // Ensure users have a userName field
        });
        if (!usersExceptFollowed) {
            console.log("Something went wrong in getUserSuggestion");
            return null;
        }
        return usersExceptFollowed;
    }
    catch (error) {
        throw new Error('Error getting users');
    }
});
exports.getUserSuggestion = getUserSuggestion;
