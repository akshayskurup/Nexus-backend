import express from "express"
import { changeUserStatus, getAllUsers, login } from "../controller/adminController"
import { adminVerifyToken, authorizeRole } from "../middleware/adminVerifyToken"
const router = express.Router()

router.post('/login',login)
router.get('/all-users',getAllUsers)
router.post('/change-user-status',adminVerifyToken,authorizeRole("admin"),changeUserStatus)

export default router
