"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controller/paymentController");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.get('/order', paymentController_1.createOrder);
router.post('/capture/:paymentId', verifyToken_1.verifyToken, paymentController_1.capturePayment);
exports.default = router;
