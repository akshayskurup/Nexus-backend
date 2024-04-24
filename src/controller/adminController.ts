import expressAsyncHandler from "express-async-handler";
import Admin from "../models/adminModel";
import { Request, Response } from "express";
import { changeStatus, fetchAllUsers, findAdminByEmail } from "../helpers/adminHelper";
import { generateToken } from "../utils/generateToken";

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
// @route   /admin/block-unblock

export const changeUserStatus =expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,status} = req.body;
    
    const user = await changeStatus(userId,status);
    if(!user){
        res.status(400)
        throw new Error("No user found")
    }
    res.status(200).json({message:"Successfully Updated",user});

})