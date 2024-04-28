import Comment from "../models/commentModel";
import { findById } from "./userHelper";



export const createNewComment = async(userId:string,postId:string,comment:string)=>{
    try {
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