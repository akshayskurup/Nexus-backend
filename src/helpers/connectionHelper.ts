import Connection from "../models/connectionModel";
import { findById } from "./userHelper";




    export const followUser = async(userId:any,followingUser:any)=>{
        try {
            await Connection.findOneAndUpdate(
                {userId},
                {$addToSet:{following:followingUser}},
                {upsert:true}
            );
            await Connection.findOneAndUpdate(
                {userId:followingUser},
                {$addToSet:{followers:userId}},
                {upsert:true}
            );
        } catch (error:any) {
            console.log(error)
            throw new Error(`Error during following: ${error.message}`)
        }
    }

    export const unFollowUser = async(userId:any,unFollowingUser:any)=>{
        try {
            await Connection.findOneAndUpdate(
                {userId},
                {$pull:{following:unFollowingUser}},
            );
      
            await Connection.findOneAndUpdate(
                {userId:unFollowingUser},
                { $pull: { followers: userId} }
            );
        } catch (error:any) {
            console.log(error);
            throw new Error(`Error during unfollowing: ${error.message}`);
        }
    }

    export const getUserConnections = async(userId:any)=>{
        try {
           const connections = await Connection.findOne({ userId }).populate("followers")
          .populate("following")
           return connections
        } catch (error:any) {
            console.log(error);
            throw new Error(`Error during unfollowing: ${error.message}`);
        }
    }
    