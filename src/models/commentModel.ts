import mongoose, { Schema } from "mongoose"

const ReplySchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    reply:{
        type:String,
        require:true
    },
}, {
    timestamps: true,
});


const commentSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    comment:{
        type:String,
        require:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
        require:true
    },
    replies:[
        ReplySchema
    ]

},{
    timestamps: true
})

const Comment = mongoose.model('comments',commentSchema);
export default Comment