import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { findById } from '../helpers/userHelper';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];
  console.log("Checking");

  if (!authorizationHeader) {
    return res.status(400).json({ message: "No token provided" });
  }

  const token = authorizationHeader.split(' ')[1];  

  jwt.verify(token, process.env.JWT_SECRET as string, async (err: JsonWebTokenError | TokenExpiredError | null, decoded: any) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        console.log("Token expired");
        return res.status(401).json({ message: "Token expired" });
      } else {
        console.log(err);
        return res.status(500).json({ message: "Failed to authenticate token" });
      }
    }
    
    if (!decoded || !decoded.role) {
      return res.status(400).json({ message: 'Invalid token structure or missing role information' });
    }

    req.user = decoded;
    console.log("req.user", req.user);
    const user = await findById(decoded.userId);
    if (user?.isBlocked) {
      return res.status(400).json({ message: "User is blocked" });
    }
    next();
  });
};

// authorizeRole middleware
export const authorizeRole = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
    return res.status(403).json({ message: 'Insufficient permissions to access this resource' });
  }

  next();
};
