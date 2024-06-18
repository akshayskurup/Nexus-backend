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
exports.getUsersExceptFollowed = exports.getConnectionController = exports.unFollow = exports.follow = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userHelper_1 = require("../helpers/userHelper");
const connectionHelper_1 = require("../helpers/connectionHelper");
// @desc    Follow User
// @route   /connection/follow
exports.follow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followingUser } = req.body;
    console.log(req.body);
    const followUserDetails = yield (0, userHelper_1.findById)(followingUser);
    if (!followUserDetails) {
        res.status(400);
        throw new Error("User not found");
    }
    yield (0, connectionHelper_1.followUser)(userId, followingUser);
    res.status(200).json({ message: "Successful Followed" });
}));
// @desc    Unfollow User
// @route   /connection/unfollow
exports.unFollow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, unFollowingUser } = req.body;
    const followUserDetails = yield (0, userHelper_1.findById)(unFollowingUser);
    if (!followUserDetails) {
        res.status(400);
        throw new Error("User not found");
    }
    yield (0, connectionHelper_1.unFollowUser)(userId, unFollowingUser);
    res.status(200).json({ message: "Successful Unfollowed" });
}));
// @desc    Get User Connections
// @route   /connection/get-connection
exports.getConnectionController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const connection = yield (0, connectionHelper_1.getUserConnections)(userId);
    res.status(200).json({ connection });
}));
// @desc    Get User Friends(a person who follow him and he followbacks)
// @route   /connection/get-friends
// export const getFriends = expressAsyncHandler(
//     async (req: Request, res: Response) => {
//       const userId = req.params.userId;
//       const friends = await getUserFriends(userId)
//       if(!friends){
//         res.status(400);
//         throw new Error("User has no connection");
//       }
//       console.log("friends",friends)
//       res.status(200).json({ friends });
//     }
//   );
exports.getUsersExceptFollowed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userConnections = yield (0, connectionHelper_1.getUserFollowing)(userId);
        if (!userConnections) {
            const allUser = yield (0, userHelper_1.allUsers)();
            res.status(200).json(allUser);
        }
        else {
            const followingIds = userConnections.map((following) => following._id);
            const users = yield (0, userHelper_1.getUserSuggestion)(followingIds);
            res.status(200).json(users);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}));
