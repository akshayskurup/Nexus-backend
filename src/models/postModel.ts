import mongoose,{Schema} from "mongoose";
import User from '../models/userModel';


const postSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    likes:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }],
        default:[]
    },
    isBlocked:{
        type:Boolean,
        default:false
    },

})

const Post = mongoose.model('posts',postSchema);
export default Post;