import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { findById } from "../helpers/userHelper";
import Connection from "../models/connectionModel";
import { followUser, getUserConnections, unFollowUser } from "../helpers/connectionHelper";

// @desc    Follow User
// @route   /connection/follow

export const follow = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,followingUser} = req.body
    const followUserDetails = await findById(followingUser);
    if(!followUserDetails){
        res.status(400);
        throw new Error("User not found");
    }
    await followUser(userId,followingUser);
    res.status(200).json({message:"Successful Followed"});
})

// @desc    Unfollow User
// @route   /connection/unfollow

export const unFollow = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId,unFollowingUser} = req.body
    const followUserDetails = await findById(unFollowingUser);
    if(!followUserDetails){
        res.status(400);
        throw new Error("User not found");
    }
    await unFollowUser(userId,unFollowingUser);
    res.status(200).json({message:"Successful Unfollowed"});
})

// @desc    Get User Connections
// @route   /connection/get-connection

export const getConnectionController = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.body;
      console.log(userId +"hello");
      const connection = await getUserConnections(userId)
      res.status(200).json({ connection });
    }
  );