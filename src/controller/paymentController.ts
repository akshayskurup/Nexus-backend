import Razorpay from "razorpay";
import dotenv from "dotenv"
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { promisify } from "util";
import request from "request";
import { update } from "../helpers/userHelper";


dotenv.config()
const instance = new Razorpay({
    key_id: process.env.KEY_ID as string,
    key_secret: process.env.KEY_SECRET as string
})

//@desc   create order
//@route  /payment/order

export const createOrder = expressAsyncHandler(async (req:Request,res:Response)=>{
    console.log("h")
    const options = {
        amount: 4999 *10, //499rs
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 0
    }
    try {
        instance.orders.create(options,async function (err,order){
            if(err){
                res.status(500)
                throw new Error("Something Went Wrong")
            }
            console.log("order",order)
            return res.status(200).json(order)
        })
    } catch (error) {
        res.status(500)
                throw new Error("Something Went Wrong")
    }
})

//@desc   CApture the payment
//@route  /payment/capture

const requestAsync = promisify(request);

export const capturePayment = expressAsyncHandler(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const user = req.user?.userId
    const url = `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${paymentId}/capture`;
    const options = {
        method: "POST",
        url: url,
        form: {
            amount: 4999 * 10, // Same As Order amount
            currency: "INR",
        },
    };

    try {
        const response = await requestAsync(options);
        const body = response.body;
        if (response.statusCode !== 200) {
            res.status(500)
            throw new Error("Something Went Wrong")
        } else {
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            console.log("Response:", body);
            if(user){
            const updatedUser = await update(user,{premium:true})
            res.status(200).json({response:JSON.parse(body),updatedUser});

            }else{
                console.log("user not found")
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500)
         throw new Error("Something Went Wrong")
    }
});