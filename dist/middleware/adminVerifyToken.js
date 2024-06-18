"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.adminVerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminVerifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        res.status(400);
        throw new Error("No token provided");
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(400);
            throw new Error("Failed to authenticate token");
        }
        if (!decoded) {
            res.status(400);
            throw new Error('Invalid token structure');
        }
        req.admin = decoded;
        next();
    });
};
exports.adminVerifyToken = adminVerifyToken;
// authorizeRole middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.admin || !req.admin.role || !req.admin.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
    }
    next();
};
exports.authorizeRole = authorizeRole;
