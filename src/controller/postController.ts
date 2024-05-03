import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createPost, findPost, getAllPost, getSavedPost, getUserPost, postDelete, postEdit, postLike, report } from "../helpers/postHelper";
import { findByEmail, findById, postSave } from "../helpers/userHelper";

//@desc   Add Post
//@route  /post/add-post

export const addPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {description,image,userId} = req.body;
    const newPost = await createPost(description,userId,image);
    if(!newPost){
        res.status(400)
        throw new Error("Cannot add post");
    }
    const post = await getAllPost();
    res.status(200).json({message:"Post Uploaded Successfully",post});
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
    const posts = await getAllPost();
    console.log("Postss",posts);
    
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

//@desc   Report Post
//@route  /post/report-post

export const reportPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,postId,reason} = req.body;
    
    const Report = await report(userId,postId,reason);
    if(!Report){
        res.status(400);
        throw new Error("Post not found");
    }
    res.status(200).json({message:"Reported the post"});
});

//@desc   Save Post
//@route  /post/save-post

export const savedPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,postId} = req.body;
    
    const user = await findById(userId);
    if(user?.isBlocked){
        res.status(400);
        throw new Error("User is Blocked");
    }
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const post = await findPost(postId)
    if(post?.isBlocked){
        res.status(400)
        throw new Error("This post is unavailable");
    }
    const updatedUser = await postSave(user,postId);
    if(!updatedUser){
        res.status(400);
        throw new Error("Post didn't save properly");
    }
    res.status(200).json({message:"Successfully Post Saved",updatedUser});
});

//@desc   Get User Post
//@route  /post/get-post

export const userPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const userId = req.params.userId;    
    const user = await findById(userId);
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const posts = await getUserPost(userId);
    res.status(200).json({message:"Successfully fetched",posts});
});


//@desc   Get User Saved Post
//@route  /post/get-saved-post

export const userSavedPost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const userId = req.params.userId;    
    const user = await findById(userId);
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const savedposts = await getSavedPost(user);
    res.status(200).json({message:"Successfully fetched",savedposts});
});

//@desc   Delete Post
//@route  /post/delete-post

export const deletePost = expressAsyncHandler(async(req:Request,res:Response)=>{
    const postId = req.params.postId;    
    console.log("post",postId);
    
    const post = await findPost(postId);
    if(!post){
        res.status(400);
        throw new Error("Post not found");
    }
    console.log("Post",post);
    
    const updatedPost = await postDelete(postId);
    if(!updatedPost){
        res.status(400);
        throw new Error("Post didn't delete properly");
    }
    console.log(updatedPost);
    
    res.status(200).json({message:"Successfully Post Saved",updatedPost});
});