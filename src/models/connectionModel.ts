import mongoose,{Schema} from "mongoose";



const connectionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    followers: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
    },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: "users" }],
        default: [],
    }
    

});
const Connection = mongoose.model('connections',connectionSchema);
export default Connection;