import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    phone:{
        type:Number
    },
    bio:{
        type:String,
        default:""
    },
    premium:{
        type:Boolean,
        default:false
    },
    profileImage:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"
    },
    bgImage:{
        type:String,
        default:"https://getuikit.com/v2/docs/images/placeholder_600x400.svg"
    },
    savedPost:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"Post"
        }],
        default:[]
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }

})

const User = mongoose.model('users',userSchema)
export default User