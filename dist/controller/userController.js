"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = exports.searchUserProfile = exports.editProfile = exports.userProfile = exports.accountSetup = exports.login = exports.resetPassword = exports.forgetOTP = exports.forgetPassword = exports.resendOTP = exports.verifyOTP = exports.registration = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendVerifyMail_1 = require("../utils/sendVerifyMail");
const userHelper_1 = require("../helpers/userHelper");
const generateToken_1 = require("../utils/generateToken");
const connectionHelper_1 = require("../helpers/connectionHelper");
//@des    Register user
//@route  /user/register
exports.registration = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const otp = otp_generator_1.default.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
    const sessionData = req.session;
    sessionData.userDetails = { name, email, password };
    sessionData.otpGeneratedTime = Date.now();
    sessionData.otp = otp;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    sessionData.userDetails.password = hashedPassword;
    const user = yield (0, userHelper_1.findByEmail)(email);
    if (user) {
        res.status(400);
        throw new Error("User already exists.");
    }
    else {
        (0, sendVerifyMail_1.sendVerifyMail)(req, name, email);
    }
    res.status(200).json({ message: "OTP has been successfully send", email });
}));
//@des    verifying OTP
//@route  /user/register-otp
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const sessionData = req.session;
    const generatedOTP = sessionData.otp;
    if (!generatedOTP || otp !== generatedOTP) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    const otpGeneratedTime = sessionData.otpGeneratedTime || 0;
    const currentTime = Date.now();
    const otpExpiryTime = 60 * 1000;
    if (currentTime - otpGeneratedTime > otpExpiryTime) {
        res.status(400).json({ message: "OTP Expired" });
        return;
    }
    const newUser = yield (0, userHelper_1.registerUser)(req);
    delete sessionData.userDetails;
    delete sessionData.otp;
    delete sessionData.otpGeneratedTime;
    if (newUser) {
        res.status(200).json({ message: "registration Successfull!", newUser });
    }
    else {
        res.status(500).json({ message: "Error registering user" });
    }
});
exports.verifyOTP = verifyOTP;
//@des    resend OTP
//@route  /user/resend-otp
exports.resendOTP = (0, express_async_handler_1.default)((req, res) => {
    var _a;
    const sessionData = req.session;
    console.log(sessionData);
    let { email = "", name = "" } = (_a = sessionData.userDetails) !== null && _a !== void 0 ? _a : {};
    const otp = otp_generator_1.default.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
    sessionData.otp = otp;
    sessionData.otpGeneratedTime = Date.now();
    (0, sendVerifyMail_1.sendVerifyMail)(req, name, email);
    res.status(200).json({ message: "OTP has been successfully resent", email });
});
//@des    forget password
//@route  /user/forget-password
exports.forgetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield (0, userHelper_1.findByEmail)(email);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    if (user) {
        const otp = otp_generator_1.default.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
        const sessionData = req.session;
        sessionData.otp = otp;
        sessionData.email = email;
        sessionData.otpGeneratedTime = Date.now();
        sessionData.userDetails = { name: user.name, email };
        console.log(req.session);
        (0, sendVerifyMail_1.sendVerifyMail)(req, user.name, email);
        res.status(200).json({ message: "OTP has been succesffully send", email });
    }
}));
//@desc     Forget password OTP verification
//@route    user/forget-otp
exports.forgetOTP = (0, express_async_handler_1.default)((req, res) => {
    const { otp } = req.body;
    const sessionData = req.session;
    const generatedOTP = sessionData.otp;
    if (!generatedOTP || otp !== generatedOTP) {
        res.status(400);
        throw new Error("Invalid OTP");
    }
    const otpGeneratedTime = sessionData.otpGeneratedTime || 0;
    const currentTime = Date.now();
    const otpExpiryTime = 60 * 1000;
    if (currentTime - otpGeneratedTime > otpExpiryTime) {
        res.status(400);
        throw new Error("OTP has expired");
    }
    delete sessionData.otp;
    delete sessionData.otpGeneratedTime;
    res.status(200).json({ message: "OTP has been verified.", email: sessionData.email });
});
//@desc     Reset password
//@route    user/reset-password
exports.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.status(400);
        throw new Error("Password is not matching");
    }
    const sessionData = req.session;
    if (!sessionData || !sessionData.email) {
        res.status(400);
        throw new Error("No session data found");
    }
    const user = yield (0, userHelper_1.findByEmail)(sessionData.email);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    yield (0, userHelper_1.update)(user._id, { password: hashedPassword });
    res.status(200).json({ message: "Password has been reset successfully" });
}));
//@desc     login
//@route    user/login
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const user = yield (0, userHelper_1.findByEmail)(email);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    const comparePass = yield bcrypt_1.default.compare(password, (_a = user === null || user === void 0 ? void 0 : user.password) !== null && _a !== void 0 ? _a : "");
    if (!comparePass) {
        res.status(400);
        throw new Error('Invalid password');
    }
    const accessToken = (0, generateToken_1.generateToken)(user === null || user === void 0 ? void 0 : user._id, "user");
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id, role: "user" }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    res.status(200).json({ message: "Login Successful",
        _id: user.id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
        bgImage: user.bgImage,
        savedPost: user.savedPost,
        bio: user.bio,
        phone: user.phone,
        name: user.name,
        isBlocked: user.isBlocked,
        token: accessToken,
        refreshToken
    });
}));
//@desc     account setup
//@route    user/account-setup
exports.accountSetup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, bio, phone, profileImage, bgImage, gender, userId } = req.body;
    console.log("REq", req.body);
    const user = yield (0, userHelper_1.findUsername)(userName);
    if (!user) {
        console.log("inside null", userId);
        const updatedUser = yield (0, userHelper_1.update)(userId, { userName, bio, phone, gender, bgImage, profileImage });
        res.status(200).json({ message: "Successfully completed account setup", updatedUser });
    }
    else {
        res.status(400);
        throw new Error('UserName already exist');
    }
}));
//@desc     Get user profile
//@route    /user/user-profile
exports.userProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    console.log(userId);
    const user = yield (0, userHelper_1.findById)(userId);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const connections = yield (0, connectionHelper_1.getUserConnections)(userId);
    res.status(200).json({ message: "Successfully fetched", user, connections });
}));
//@desc     edit profile
//@route    user/edit-profile
exports.editProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { userName, bio, profileImage, bgImage, userId } = req.body;
    console.log("req.bodyyy", req.body);
    console.log("req.userr", req.user);
    if (req.user || userId) {
        const User = yield (0, userHelper_1.findById)(userId ? userId : (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId);
        if (!User) {
            res.status(400);
            throw new Error('User not found');
        }
        else {
            if (userName) {
                const existingUserName = yield (0, userHelper_1.findUsername)(userName);
                if (existingUserName) {
                    res.status(400);
                    throw new Error('UserName already exist');
                }
                yield (0, userHelper_1.update)(userId, { userName });
            }
            if (bio)
                yield (0, userHelper_1.update)(userId, { bio });
            if (profileImage)
                yield (0, userHelper_1.update)(userId, { profileImage });
            if (bgImage)
                yield (0, userHelper_1.update)(userId, { bgImage });
        }
        const user = yield (0, userHelper_1.findById)(userId ? userId : (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId);
        const accessToken = (0, generateToken_1.generateToken)(user === null || user === void 0 ? void 0 : user._id, "user");
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id, role: "user" }, process.env.JWT_REFRESH_SECRET, { expiresIn: '5d' });
        res.status(200).json({ message: "Successful",
            _id: user === null || user === void 0 ? void 0 : user.id,
            userName: user === null || user === void 0 ? void 0 : user.userName,
            email: user === null || user === void 0 ? void 0 : user.email,
            profileImage: user === null || user === void 0 ? void 0 : user.profileImage,
            bgImage: user === null || user === void 0 ? void 0 : user.bgImage,
            savedPost: user === null || user === void 0 ? void 0 : user.savedPost,
            bio: user === null || user === void 0 ? void 0 : user.bio,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            name: user === null || user === void 0 ? void 0 : user.name,
            isBlocked: user === null || user === void 0 ? void 0 : user.isBlocked,
            token: accessToken,
            refreshToken });
    }
}));
//@desc     Search user profile
//@route    /user/search-user
exports.searchUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    console.log(search);
    const users = yield (0, userHelper_1.searchUser)(search);
    if (!users) {
        res.status(400);
        throw new Error('User not found');
    }
    res.status(200).json({ message: "Successfully fetched", users });
}));
//@desc     Refresh token
//@route    /user/refresh-token
exports.refreshTokenHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Refresj tokem works");
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token is required');
    }
    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
        res.status(401);
        throw new Error('Invalid refresh token');
    }
    const userId = decoded.userId;
    // const user = await getUserDetails(userId);
    // Generate new access token based on user role
    const accessToken = yield (0, generateToken_1.generateToken)(userId, "user");
    res.status(200).json({ accessToken });
}));
