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
exports.authorizeRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userHelper_1 = require("../helpers/userHelper");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.headers['authorization'];
    console.log("Chceking");
    if (!authorizationHeader) {
        res.status(400);
        throw new Error("No token provided");
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(400);
            throw new Error("Failed to authenticate token");
        }
        if (!decoded || !decoded.role) {
            res.status(400);
            throw new Error('Invalid token structure or missing role information');
        }
        req.user = decoded;
        console.log("req.user", req.user);
        const user = yield (0, userHelper_1.findById)(decoded.userId);
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            // res.status(400);
            // throw new Error('User is Blocked' );
            return res.status(400).json({ message: "User is blocked" });
        }
        next();
    }));
});
exports.verifyToken = verifyToken;
// authorizeRole middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
    }
    next();
};
exports.authorizeRole = authorizeRole;
// // Endpoint for token refreshing
// export const refreshAccessToken = (req: Request, res: Response) => {
//   const authorizationHeader = req.headers['authorization'];
//   if (!authorizationHeader) {
//     res.status(400)
//     throw new Error("No token provided");
//   }
//   const refreshToken = authorizationHeader.split(' ')[1];
//   // Verify the refresh token
//   try {
//     const decoded = jwt.verify(refreshToken,  process.env.JWT_SECRET as string) as UserPayload;
//     const accessToken = jwt.sign({ userId: decoded.userId, role: decoded.role },  process.env.JWT_SECRET as string, { expiresIn: '1hr' });
//     res.status(200).json({ message:"Token "accessToken });
//   } catch (error) {
//     res.status(400)
//     throw new Error("Invalid refresh token");
//   }
// };
