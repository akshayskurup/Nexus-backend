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
exports.capturePayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const util_1 = require("util");
const request_1 = __importDefault(require("request"));
const userHelper_1 = require("../helpers/userHelper");
dotenv_1.default.config();
const instance = new razorpay_1.default({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});
//@desc   create order
//@route  /payment/order
exports.createOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("h");
    const options = {
        amount: 4999 * 10, //499rs
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 0
    };
    try {
        instance.orders.create(options, function (err, order) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(500);
                    throw new Error("Something Went Wrong");
                }
                console.log("order", order);
                return res.status(200).json(order);
            });
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Something Went Wrong");
    }
}));
//@desc   CApture the payment
//@route  /payment/capture
const requestAsync = (0, util_1.promisify)(request_1.default);
exports.capturePayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paymentId = req.params.paymentId;
    const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
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
        const response = yield requestAsync(options);
        const body = response.body;
        if (response.statusCode !== 200) {
            res.status(500);
            throw new Error("Something Went Wrong");
        }
        else {
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            console.log("Response:", body);
            if (user) {
                const updatedUser = yield (0, userHelper_1.update)(user, { premium: true });
                res.status(200).json({ response: JSON.parse(body), updatedUser });
            }
            else {
                console.log("user not found");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500);
        throw new Error("Something Went Wrong");
    }
}));
