import { Request } from "express";
import Post from "../models/postModel";


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
        const posts = await Post.find({}).populate("userId");
        return posts;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during fetching post: ${error.message}`);
    }
    
}

export const postLike = async(userId:any,postId:any)=>{
    try {
        const post = await Post.findById(postId);
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
            isBlocked:false
        }).populate("userId").sort({date:-1});
        return posts;
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error during getUserPost: ${error.message}`);
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