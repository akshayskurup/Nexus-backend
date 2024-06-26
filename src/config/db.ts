import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const mongoURL:any = process.env.MONGODB_URL;
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add any other options you need here to avoid deprecation warnings
        }as any);        
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.error(error)

    }
}

export default connectDB