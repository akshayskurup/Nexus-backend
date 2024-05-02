import expressAsyncHandler from "express-async-handler";
import Admin from "../models/adminModel";
import { Request, Response } from "express";
import { changeStatus, fetchAllReportedPost, fetchAllUsers, findAdminByEmail } from "../helpers/adminHelper";
import { generateToken } from "../utils/generateToken";
import { changePostStatus } from "../helpers/postHelper";

// @desc    Admin Login
// @route   /admin/login

export const login = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const admin = await findAdminByEmail(email)
    if(!admin){
        throw new Error("Admin not found");
    }
    if (password!==admin.password) {
        res.status(400)
        throw new Error('Invalid password');
    }
    res.status(200).json({
        message:"Login Successful",
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id,"admin"),
    });
    
});

// @desc    Get Users
// @route   /admin/all-users

export const getAllUsers = expressAsyncHandler(async(req:Request,res:Response)=>{
    const allUsers = await fetchAllUsers();
    if(!allUsers){
        res.status(400)
        throw new Error("No user found")
    }
    res.status(200).json({message:"Successfully fetched all users",allUsers});

})

// @desc    Block/Unblock Users
// @route   /admin/change-user-status

export const changeUserStatus =expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,status} = req.body;
    
    const user = await changeStatus(userId,status);
    if(!user){
        res.status(400)
        throw new Error("No user found")
    }
    res.status(200).json({message:"Successfully Updated",users:await fetchAllUsers()});

})

// @desc    Get Posts
// @route   /admin/all-posts

export const getAllPosts = expressAsyncHandler(async(req:Request,res:Response)=>{
    const allPosts = await fetchAllReportedPost();
    if(!allPosts){
        res.status(400)
        throw new Error("No posts")
    }
    res.status(200).json({message:"Successfully fetched all the post",allPosts});

})

// @desc    Block/Unblock Post
// @route   /admin/change-post-status

export const changeReportPostStatus =expressAsyncHandler(async(req:Request,res:Response)=>{
    const {postId,status} = req.body;   
    
    const post = await changePostStatus(postId,status);
    if(!post){
        res.status(400)
        throw new Error("No post found")
    }
    res.status(200).json({message:"Successfully Updated",post:await fetchAllReportedPost()});

})