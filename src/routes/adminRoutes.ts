import express from "express";
import { changeReportPostStatus, changeUserStatus, getAllPosts, getAllUsers, login } from "../controller/adminController";
import { adminVerifyToken, authorizeRole } from "../middleware/adminVerifyToken";
const router = express.Router();

router.post('/login',login);
router.get('/all-users',getAllUsers);
router.post('/change-user-status',adminVerifyToken,authorizeRole("admin"),changeUserStatus);
router.get('/all-posts',getAllPosts);
router.post('/change-post-status',changeReportPostStatus)

export default router;
