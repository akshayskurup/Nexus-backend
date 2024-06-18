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
exports.getUserFollowing = exports.getUserConnections = exports.unFollowUser = exports.followUser = void 0;
const connectionModel_1 = __importDefault(require("../models/connectionModel"));
const followUser = (userId, followingUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectionModel_1.default.findOneAndUpdate({ userId }, { $addToSet: { following: followingUser } }, { upsert: true });
        yield connectionModel_1.default.findOneAndUpdate({ userId: followingUser }, { $addToSet: { followers: userId } }, { upsert: true });
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during following: ${error.message}`);
    }
});
exports.followUser = followUser;
const unFollowUser = (userId, unFollowingUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectionModel_1.default.findOneAndUpdate({ userId }, { $pull: { following: unFollowingUser } });
        yield connectionModel_1.default.findOneAndUpdate({ userId: unFollowingUser }, { $pull: { followers: userId } });
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during unfollowing: ${error.message}`);
    }
});
exports.unFollowUser = unFollowUser;
const getUserConnections = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connections = yield connectionModel_1.default.findOne({ userId }).populate("followers")
            .populate("following");
        return connections;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during unfollowing: ${error.message}`);
    }
});
exports.getUserConnections = getUserConnections;
const getUserFollowing = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connections = yield connectionModel_1.default.findOne({ userId }).populate("followers")
            .populate("following");
        return connections === null || connections === void 0 ? void 0 : connections.following;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during unfollowing: ${error.message}`);
    }
});
exports.getUserFollowing = getUserFollowing;
// export const getUserFriends = async(userId:any)=>{
//     try {
//         console.log(userId)
//         const user = await Connection.findOne({userId})
//         if(user){
//             console.log("userss",user.followers)
//             const followers = user.followers
//             const following = user.following
//             const data = {followers:followers,following:following}
//             const friends = []
//             followers.map((user:any)=>{
//                 following.some((followingUser)=>followingUser===user)
//             })
//             return data
//         }
//     } catch (error:any) {
//         console.log(error);
//         throw new Error(`Error during getUSerFriends: ${error.message}`);
//     }
// }
