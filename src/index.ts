import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import postRoutes from "./routes/postRoutes";
import connectionRoutes from './routes/connectionRoutes';
import { errorHandler } from "./middleware/errorHandling";

dotenv.config();

const app = express();
const port = process.env.PORT
connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));

declare module "express-session" {
    interface Session {
        userDetails?: {
            name?: string;
            email?: string;
            password?: string;
        };
        otp?: string;
        otpGeneratedTime?: number;
        email: string;
    }
}

app.use('/api/user',userRoutes );
app.use('/api/admin',adminRoutes );
app.use('/api/post',postRoutes);
app.use('/api/connection',connectionRoutes)
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
    
});