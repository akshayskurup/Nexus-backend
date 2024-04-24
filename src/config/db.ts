import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const mongoURL:any = process.env.MONGODB_URL;
        await mongoose.connect(mongoURL)
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.error(error)

    }
}

export default connectDB