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

    export const getUserFollowing = async(userId:any)=>{
        try {
           const connections = await Connection.findOne({ userId }).populate("followers")
          .populate("following")
           return connections?.following
        } catch (error:any) {
            console.log(error);
            throw new Error(`Error during unfollowing: ${error.message}`);
        }
    }

    
    
    // export const getUserFriends = async(userId:any)=>{
    //     try {
    //         console.log(userId)
    //         const user = await Connection.findOne({userId})
    //         if(user){
    //             console.log("userss",user.followers)
    //             const followers = user.followers
    //             const following = user.following
    //             const data = {followers:followers,following:following}
    //             const friends = []
    //             followers.map((user:any)=>{
    //                 following.some((followingUser)=>followingUser===user)
    //             })
    //             return data
    //         }
            
    //     } catch (error:any) {
    //         console.log(error);
    //         throw new Error(`Error during getUSerFriends: ${error.message}`);
    //     }
    // }