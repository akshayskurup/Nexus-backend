import Comment from "../models/commentModel";
import { findPost } from "./postHelper";
import { findById } from "./userHelper";



export const createNewComment = async(userId:string,postId:string,comment:string)=>{
    try {
        console.log("createNEwComment",userId);
        const post = await findPost(postId);
        if(post?.isBlocked){
            return null;
        }
        const newComment = await Comment.create({
            userId,
            postId,
            comment
        });
        return newComment;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during creating comment: ${error.message}`)
    }
}

export const getAllComments = async(postId:any)=>{
    try {
        const comments = await Comment.find({postId:postId, isDeleted:false})
        .populate("userId")
        .populate("replies.userId")

        return comments;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during retreiving comments: ${error.message}`)
    }
}

export const getMyComment = async(userId:string,postId:string)=>{
    try {
        const myComment = await Comment.findOne({ userId:userId, postId: postId, isDeleted: false })
        .sort({ _id: -1 });        
        return myComment?.comment;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during retreiving my comments: ${error.message}`)
    }
}

export const deleteComment = async(commentId:string)=>{
    try {
        const comment = await Comment.findById(commentId)
        if(comment){
            comment.isDeleted = true;
            await comment.save();
            console.log(comment);
            
            return comment;
        }
        console.log("commentId",commentId);
        
        
    } catch (error:any) {
        console.log(error);
        throw new Error(`Error during deletingcomments: ${error.message}`)

    }
}

export const findComment = async(commentId:any)=>{
    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            return null;
        }
        return comment;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during finding comments: ${error.message}`)
    }
}

export const addReply = async(comment:any,newComment:any)=>{
    try {
        comment.replies.push(newComment);
        const replyComment = await comment.save();
        return replyComment;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during retreiving comments: ${error.message}`)
    }
}

