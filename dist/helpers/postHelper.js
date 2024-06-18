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
exports.changePostStatus = exports.report = exports.postEdit = exports.postDelete = exports.findPost = exports.getSavedPost = exports.getUserPost = exports.postLike = exports.getAllPost = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const createPost = (description, userId, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("userId", userId);
        const newPost = yield postModel_1.default.create({
            userId,
            description,
            imageUrl: image ? image : '',
        });
        return newPost;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during creating post: ${error.message}`);
    }
});
exports.createPost = createPost;
const getAllPost = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find({ isDeleted: false, isBlocked: false }).populate("userId").sort({ date: -1 });
        return posts;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during fetching post: ${error.message}`);
    }
});
exports.getAllPost = getAllPost;
// export const findPost = async(postId:string)=>{
//     try {
//         const posts = await Post.find({_id:postId,isDeleted:false,isBlocked:false}).populate("userId").sort({date:-1});
//         return posts;
//     } catch (error:any) {
//         console.log(error)
//         throw new Error(`Error during fetching post: ${error.message}`);
//     }
// }
const postLike = (userId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(postId);
        if (post === null || post === void 0 ? void 0 : post.isBlocked) {
            return null;
        }
        if (post === null || post === void 0 ? void 0 : post.likes.includes(userId)) {
            yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });
        }
        else {
            yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $push: { likes: userId } }, { new: true });
        }
        return post;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during liking post: ${error.message}`);
    }
});
exports.postLike = postLike;
const getUserPost = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find({
            userId,
            isBlocked: false,
            isDeleted: false
        }).populate("userId").sort({ date: -1 });
        return posts;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
});
exports.getUserPost = getUserPost;
const getSavedPost = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedPosts = yield postModel_1.default.find({
            _id: { $in: user.savedPost },
            isBlocked: false,
            isDeleted: false
        }).populate("userId");
        return savedPosts;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
});
exports.getSavedPost = getSavedPost;
const findPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("inside findPost", postId);
        const post = yield postModel_1.default.findById(postId).populate('userId');
        if (!post) {
            return null;
        }
        console.log("Posee", post);
        return post;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during findPost: ${error.message}`);
    }
});
exports.findPost = findPost;
const postDelete = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return null;
        }
        post.isDeleted = true;
        post.save();
        const fetchAllPost = yield (0, exports.getAllPost)();
        return fetchAllPost;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during deleting: ${error.message}`);
    }
});
exports.postDelete = postDelete;
const postEdit = (userId, postId, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(postId);
        if (post) {
            if (description) {
                post.description = description;
            }
            yield post.save();
            return post;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
});
exports.postEdit = postEdit;
const report = (userId, postId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(postId);
        if (post) {
            const existingReport = yield reportModel_1.default.findOne({ userId: userId, postId: postId });
            if (existingReport) {
                existingReport.reason.push(reason);
                yield existingReport.save();
                return existingReport;
            }
            else {
                const report = yield reportModel_1.default.create({
                    userId,
                    postId,
                    reason
                });
                const totalReports = yield reportModel_1.default.countDocuments({ postId: postId });
                if (totalReports > 3) {
                    const post = yield postModel_1.default.findById(postId);
                    if (post) {
                        post.isBlocked = true;
                        yield post.save();
                        console.log("Post after blocking", post);
                    }
                }
                return report;
            }
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
});
exports.report = report;
const changePostStatus = (postId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield postModel_1.default.findByIdAndUpdate(postId, { $set: { isBlocked: status } }, { new: true });
        if (!user) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error in changeStatus: ${error.message}`);
    }
});
exports.changePostStatus = changePostStatus;
