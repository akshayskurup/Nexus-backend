"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const adminVerifyToken_1 = require("../middleware/adminVerifyToken");
const router = express_1.default.Router();
router.post('/login', adminController_1.login);
router.get('/all-users', adminController_1.getAllUsers);
router.post('/change-user-status', adminVerifyToken_1.adminVerifyToken, (0, adminVerifyToken_1.authorizeRole)("admin"), adminController_1.changeUserStatus);
router.get('/all-posts', adminController_1.getAllPosts);
router.post('/change-post-status', adminController_1.changeReportPostStatus);
exports.default = router;
