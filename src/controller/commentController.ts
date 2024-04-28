import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { formatDistanceToNow } from 'date-fns';
import { createNewComment, deleteComment, getAllComments, getMyComment } from "../helpers/commentHelper";

// @desc    Add Comment
// @route   /post/add-comment

export const addComment = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,postId,comment} = req.body;
    const newComment = await createNewComment(userId,postId,comment);
    if(!newComment){
        res.status(400)
        throw new Error("Cannot add comment");
    }
    const comments = await getAllComments(postId);

    res.status(200).json({message:"Comment Posted Successfully",comments});
});

// @desc    My Comment
// @route   /post/add-comment

export const myComment = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.query?.userId as string | undefined;
    const postId = req.query?.postId as undefined;
    if (!userId || !postId) {
        res.status(400)
        throw new Error("Cannot userId and postId is not available");
    }
    const comment = await getMyComment(userId, postId);
    
    res.status(200).json({ message: "Your comment fetched", comment });
});
  
// @desc    Get All  Comments
// @route   /post/get-comments

export const allComments = expressAsyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId
    const comment = await getAllComments(postId);
    if(!comment){
        res.status(400)
        throw new Error("No comments");
    }
    const commentsWithElapsedTime = comment.map(Comment => ({
        ...Comment.toObject(),
        elapsed: formatDistanceToNow(new Date(Comment.createdAt), { addSuffix: true })
    }));
    res.status(200).json({ message: "Comment fetched", comment:commentsWithElapsedTime });
});

// @desc    Get Comment Count
// @route   /post/get-comments-count

export const commentsCount = expressAsyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId
    const totalComment = (await getAllComments(postId)).length;    
    
    res.status(200).json({ message: "Comment fetched", totalComment });
});

// @desc    Delete Comment
// @route   /post/delete-comment

export const commentDelete = expressAsyncHandler(async (req: Request, res: Response) => {
    const {commentId} = req.body
    console.log("commentId",req.body);
    
    const comment = await deleteComment(commentId);
    if(!comment){
        res.status(400)
        throw new Error("No comments");
    }
    const comments = await getAllComments(comment.postId)
    res.status(200).json({ message: "Comment fetched",comments});
});