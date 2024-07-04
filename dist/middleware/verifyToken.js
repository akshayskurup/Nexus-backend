"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const userHelper_1 = require("../helpers/userHelper");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.headers['authorization'];
    console.log("Checking");
    if (!authorizationHeader) {
        return res.status(400).json({ message: "No token provided" });
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Token expired");
                return res.status(401).json({ message: "Token expired" });
            }
            else {
                console.log(err);
                return res.status(500).json({ message: "Failed to authenticate token" });
            }
        }
        if (!decoded || !decoded.role) {
            return res.status(400).json({ message: 'Invalid token structure or missing role information' });
        }
        req.user = decoded;
        console.log("req.user", req.user);
        const user = yield (0, userHelper_1.findById)(decoded.userId);
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            return res.status(400).json({ message: "User is blocked" });
        }
        next();
    }));
});
exports.verifyToken = verifyToken;
// authorizeRole middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
        return res.status(403).json({ message: 'Insufficient permissions to access this resource' });
    }
    next();
};
exports.authorizeRole = authorizeRole;
