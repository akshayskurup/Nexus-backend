import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import otpGenerator from 'otp-generator';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { sendVerifyMail } from "../utils/sendVerifyMail";
import { findByEmail, findUsername, registerUser, update } from "../helpers/userHelper";
import { generateToken } from "../utils/generateToken";


//@des    Register user
//@route  /user/register


export const registration = expressAsyncHandler(
    async(req:Request,res:Response)=>{
        const {name,email,password} = req.body;
        const otp = otpGenerator.generate(6,{ digits: true,specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false});
        const sessionData = req.session;
        sessionData.userDetails = {name,email,password};
        sessionData.otpGeneratedTime = Date.now();
        sessionData.otp = otp;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        sessionData.userDetails.password = hashedPassword;
        const user = await findByEmail(email);
        if(user){
            res.status(400);
            throw new Error("User already exists.")
        }else{
            sendVerifyMail(req,name,email);
        }
        res.status(200).json({message:"OTP has been successfully send" , email});
    }
)

//@des    verifying OTP
//@route  /user/register-otp

export const verifyOTP = async(req:Request,res:Response)=>{
    const {otp} = req.body;
    const sessionData = req.session;
    const generatedOTP = sessionData.otp;
    if(!generatedOTP || otp!==generatedOTP){
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    const otpGeneratedTime = sessionData.otpGeneratedTime||0;
    const currentTime = Date.now();
    const otpExpiryTime = 60*1000;
    if(currentTime-otpGeneratedTime>otpExpiryTime){
        res.status(400).json({ message: "OTP Expired" });
        return;
    }
    const newUser = await registerUser(req);
    delete sessionData.userDetails;
    delete sessionData.otp;
    delete sessionData.otpGeneratedTime;
    if(newUser){
        res.status(200).json({message:"registration Successfull!",newUser});
    }else{
        res.status(500).json({message:"Error registering user"});
    }  
}

//@des    resend OTP
//@route  /user/resend-otp

export const resendOTP = expressAsyncHandler((req:Request,res:Response)=>{  
    const sessionData = req.session
    console.log(sessionData);
    let {email="",name=""} = sessionData.userDetails ?? {};

    const otp = otpGenerator.generate(6,{ digits: true,specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false});
    sessionData.otp = otp;
    sessionData.otpGeneratedTime = Date.now();
    sendVerifyMail(req,name,email);
    res.status(200).json({ message: "OTP has been successfully resent", email });
})

//@des    forget password
//@route  /user/forget-password

export const forgetPassword = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {email} = req.body;
    const user = await findByEmail(email);
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    if(user){
        const otp = otpGenerator.generate(6,{ digits: true,specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false});
        const sessionData = req.session;
        sessionData.otp = otp;
        sessionData.email = email;
        sessionData.otpGeneratedTime = Date.now();
        sessionData.userDetails = {name:user.name,email}
        console.log(req.session)
        sendVerifyMail(req,user.name,email);
        res.status(200).json({message:"OTP has been succesffully send",email});
    }
})

//@desc     Forget password OTP verification
//@route    user/forget-otp

export const forgetOTP = expressAsyncHandler((req:Request,res:Response)=>{
    const {otp} = req.body;
    const sessionData = req.session;
    const generatedOTP = sessionData.otp;
    if(!generatedOTP || otp!==generatedOTP){
        res.status(400);
        throw new Error("Invalid OTP");
    }
    const otpGeneratedTime = sessionData.otpGeneratedTime||0;
    const currentTime = Date.now();
    const otpExpiryTime = 60*1000;
    if(currentTime-otpGeneratedTime>otpExpiryTime){
        res.status(400)
        throw new Error("OTP has expired")
    }
    delete sessionData.otp;
    delete sessionData.otpGeneratedTime;
    
    res.status(200).json({message:"OTP has been verified.",email:sessionData.email})
})

//@desc     Reset password
//@route    user/reset-password

export const resetPassword = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {password,confirmPassword} = req.body;
    if(password!==confirmPassword){
        res.status(400);
        throw new Error("Password is not matching");
    }
    const sessionData = req.session;
    if(!sessionData||!sessionData.email){
        res.status(400);
        throw new Error("No session data found");
    }
    const user = await findByEmail(sessionData.email);
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    await update(user._id,{password:hashedPassword});
    res.status(200).json({ message: "Password has been reset successfully"});
})

//@desc     login
//@route    user/login

export const login = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await findByEmail(email);
    if(!user){
        res.status(400);
        throw new Error("User not found");
    }
    const comparePass = await bcrypt.compare(password, user?.password ?? "");
    if (!comparePass) {
        res.status(400);
        throw new Error('Invalid password');
    }

    const accessToken = generateToken(user?._id, "user");
    const refreshToken = jwt.sign({ userId: user?._id, role:"user" }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });

    res.status(200).json({message:"Login Successful",
    _id: user.id,
      userName: user.userName,
      email: user.email,
      profileImage: user.profileImage,
      bgImage: user.bgImage,
      savedPost: user.savedPost,
      bio: user.bio,
      phone: user.phone,
      name: user.name,
      isBlocked:user.isBlocked,
      token:accessToken,
      refreshToken

    })
})

//@desc     account setup
//@route    user/account-setup

export const accountSetup = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userName,bio,phone,profileImage,bgImage,gender,userId} = req.body;
    console.log("req.body",req.user?.userId)
    console.log(req.body)
    const user = await findUsername(userName);
    if (!user) {
        const updatedUser = await update(userId,{userName,bio,phone,gender,bgImage,profileImage})
        res.status(200).json({message:"Successfully completed account setup",updatedUser})
    }else{
        res.status(400);
        throw new Error('UserName already exist');
    }
})

//@desc     Refresh token
//@route    /user/refresh-token
export const refreshTokenHandler = expressAsyncHandler(async(req:Request,res:Response)=>{
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token is required');
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
        const userId = decoded.userId;
        // const user = await getUserDetails(userId);
        // Generate new access token based on user role
        const accessToken = generateToken(userId, "user");

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(401);
        throw new Error('Invalid refresh token');
    }
});