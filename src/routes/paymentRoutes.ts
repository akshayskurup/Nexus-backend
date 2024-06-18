import express from "express"
import { capturePayment, createOrder } from "../controller/paymentController"
import { verifyToken } from "../middleware/verifyToken"

const router = express.Router()

router.get('/order',createOrder)
router.post('/capture/:paymentId',verifyToken, capturePayment)

export default router