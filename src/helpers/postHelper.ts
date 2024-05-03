import { Request } from "express";
import Post from "../models/postModel";
import Report from "../models/reportModel";
import { findById } from "./userHelper";


export const createPost = async(description:string,userId:string,image?:string)=>{
    try {
        console.log("userId",userId);
        
        const newPost = await Post.create({
            userId,
            description,
            imageUrl:image?image:'',

        })
        return newPost;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during creating post: ${error.message}`);
    }
}

export const getAllPost = async()=>{
    try {
        const posts = await Post.find({isDeleted:false,isBlocked:false}).populate("userId").sort({date:-1});
        return posts;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during fetching post: ${error.message}`);
    }
    
}

export const postLike = async(userId:any,postId:any)=>{
    try {
        const post = await Post.findById(postId);
        if(post?.isBlocked){
            return null
        }
        if(post?.likes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{likes:userId}}, 
                {new:true}
            )
        }else{
            await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{likes:userId}},
                {new:true}
            )
        }
        return post
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during liking post: ${error.message}`);
    }
}

export const getUserPost = async(userId:any)=>{
    try {
        const posts = await Post.find({
            userId,
            isBlocked:false,
            isDeleted:false
        }).populate("userId").sort({date:-1});
        return posts;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
}

export const getSavedPost = async(user:any)=>{
    try {
        const savedPosts = await Post.find({
            _id: { $in: user.savedPost},
            isBlocked:false,
            isDeleted:false
        }).populate("userId");
        return savedPosts;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
}

export const findPost = async(postId:any)=>{
    try {
        console.log("inside findPost",postId);
        
        const post = await Post.findById(postId);
        if(!post){
            return null
        }
        console.log("Posee",post);
        
        return post
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during findPost: ${error.message}`);
    }
}

export const postDelete = async(postId:any)=>{
    try {
        const post = await Post.findById(postId);
        if(!post){
            return null
        }
        post.isDeleted = true
        post.save()
        const fetchAllPost = await getAllPost()
        return fetchAllPost
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during deleting: ${error.message}`);
    }
}


export const postEdit = async(userId:any,postId:any,description:string)=>{
    try {
       const post = await Post.findById(postId);
       if(post){
           if(description){
            post.description = description;
           }
           await post.save();
            return post;
       }
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
}

export const report = async(userId:any,postId:any,reason:string)=>{
    try {
       const post = await Post.findById(postId);
       if(post){
           const report = await Report.create({
            userId,
            postId,
            reason
           })
           return report
       }
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during getUserPost: ${error.message}`);
    }
}

export const changePostStatus = async(postId:string,status:boolean)=>{
    try {
        const user = await Post.findByIdAndUpdate(postId,{ $set: {isBlocked:status} },{new:true})
        if(!user){
            return null
        }
        return user
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error in changeStatus: ${error.message}`)
    }
}