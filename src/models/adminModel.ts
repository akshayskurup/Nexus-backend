import mongoose, { Schema } from "mongoose"


const adminSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    }

})

const Admin = mongoose.model('admins',adminSchema)
export default Admin