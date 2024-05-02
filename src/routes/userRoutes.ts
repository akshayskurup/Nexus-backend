import express from "express"
const router = express.Router()
import{accountSetup, editProfile, forgetOTP, forgetPassword, login, refreshTokenHandler, registration,resendOTP,resetPassword,userProfile,verifyOTP} from '../controller/userController'
import { authorizeRole, verifyToken } from "../middleware/verifyToken";


router.post('/register',registration);
router.post('/register-otp',verifyOTP);
router.post('/resend-otp',resendOTP);
router.post('/forget-password',forgetPassword);
router.post('/forget-otp',forgetOTP);
router.post('/reset-password',resetPassword);
router.post('/login',login);
router.post('/account-setup',verifyToken,authorizeRole('user'),accountSetup);
router.post('/edit-profile',verifyToken,authorizeRole('user'),editProfile);
router.get('/user-profile/:userId',userProfile)
router.post('/refresh-token', refreshTokenHandler);



export default router