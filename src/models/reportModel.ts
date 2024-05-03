import mongoose, { Schema } from "mongoose"


const reportSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"posts",
        required:true
    },
    reason:{
        type:String,
        require:true
    }

})

const Report = mongoose.model('reports',reportSchema);
export default Report