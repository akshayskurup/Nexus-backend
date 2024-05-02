import bcrypt from "bcrypt"
import User from "../models/userModel";
import { Request } from "express";

export const registerUser = async(req:Request)=>{
    try {
        const userData = req.session.userDetails;
        const newUser = new User({
            name:userData?.name,
            email:userData?.email,
            password:userData?.password
        });
        await newUser.save()
        return newUser;
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
}

export const findByEmail = async(email:string)=>{
    try {
        const user = await User.findOne({email});
        return user
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding user by email: ${error.message}`)
    }
}

export const findById = async(id:any)=>{
    try {
        const user = await User.findById(id);
        return user
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error finding user by email: ${error.message}`)
    }
}

export const update = async(userId:any,updateField:any)=>{
    console.log("updateField",updateField);
    
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateField },{new:true});
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    } catch (error:any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

export const findUsername = async(userName:string)=>{
    try {
        const user = await User.findOne({userName});
        console.log("findUSerame",user)
        if (user) {
            return user;
        }
        return null;
    } catch (error:any) {
        throw new Error(`Error finding user: ${error.message}`);
    }
}

export const postSave = async(user:any,postId:any)=>{
    try {
        const isSaved = user.savedPost.includes(postId);
        if(isSaved){
        const updatedUser = await User.findOneAndUpdate(
            {_id:user._id},
            {$pull:{savedPost:postId}},
            {new:true}
        )
        return updatedUser;
        }else{
          const updatedUser = await User.findOneAndUpdate(
                {_id:user._id},
                {$push:{savedPost:postId}},
                {new:true}
            )
        return updatedUser;
        }
    } catch (error:any) {
        throw new Error(`Error in savepost: ${error.message}`);
    }
}