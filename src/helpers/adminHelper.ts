import bcrypt from "bcrypt"
import Admin from "../models/adminModel";
import { Request } from "express";
import User from "../models/userModel";
import Post from "../models/postModel";
import Report from "../models/reportModel";


export const findAdminByEmail = async(email:string)=>{
    try {
        const admin = await Admin.findOne({email});
        return admin
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding admin by email: ${error.message}`)
    }
}

export const fetchAllUsers = async()=>{
    try {
        const users = await User.find();
        if(!users){
            return null
        }
        return users
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding all Users: ${error.message}`)
    }
}

export const fetchUserswithPagination = async(page: number, limit: number)=>{
    try {
        const startIndex = (page - 1) * limit;
        const users = await User.find().skip(startIndex).limit(limit);        
        if(!users){
            return null
        }
        return users
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding all Users: ${error.message}`)
    }
}

export const userCount = async()=>{
    try {
        const users = await User.countDocuments({})       
        if(!users){
            return null
        }
        return users
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error while counting: ${error.message}`)
    }
}
export const reportedPostCount = async()=>{
    try {
        const reportCount = await Report.countDocuments({})       
        if(!reportCount){
            return null
        }
        return reportCount
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error while counting: ${error.message}`)
    }
}

export const changeStatus = async(userId:string,status:boolean)=>{
    try {
        const user = await User.findByIdAndUpdate(userId,{ $set: {isBlocked:status} },{new:true})
        if(!user){
            return null
        }
        console.log("User after changing the status",user);
        return user
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error in changeStatus: ${error.message}`)
    }
}

export const fetchAllReportedPost = async(page: number, limit: number)=>{
    try {
        const startIndex = (page - 1) * limit;
        const posts = await Report.find().populate("postId").populate("userId").skip(startIndex).limit(limit);;
        if(!posts){
            return null
        }
        return posts
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding all Posts: ${error.message}`)
    }
}