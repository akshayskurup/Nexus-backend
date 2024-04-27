import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createPost, getAllPost, getUserPost, postEdit, postLike } from "../helpers/postHelper";

//@desc   Add Post
//@route  /post/add-post

export const addPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {description,image,userId} = req.body;
    const newPost = await createPost(description,userId,image);
    if(!newPost){
        res.status(400)
        throw new Error("Cannot add post");
    }
    res.status(200).json({message:"Post Uploaded Successfully",newPost});
});

//@desc   Get Post
//@route  /post/get-post

export const getPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const post = await getAllPost();
    if(!post){
        res.status(400);
        throw new Error("No post available");
    }
    res.status(200).json({message:"Fetched all Post successfully",post});
});

//@desc   Like Post
//@route  /post/get-post

export const likePost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,postId} = req.body;
    
    const post = await postLike(userId,postId);
    if(!post){
        res.status(400);
        throw new Error("Post not found");
    }
    const posts = await getUserPost(userId);
    res.status(200).json({message:"Successfully liked",posts});
});

//@desc   Edit Post
//@route  /post/update-post

export const editPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,postId,description} = req.body;
    
    const post = await postEdit(userId,postId,description);
    if(!post){
        res.status(400);
        throw new Error("Post not found");
    }
    const posts = await getUserPost(userId);
    res.status(200).json({message:"Successfully updated",posts});
});