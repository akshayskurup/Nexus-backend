

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  adminId?: string,
  role?: string
}

declare module 'express' {
    interface Request {
      admin?: UserPayload; 
    }
  }

export const adminVerifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    res.status(400)
    throw new Error("No token provided");
  }

  const token = authorizationHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
    if (err) {
        res.status(400);
        throw new Error("Failed to authenticate token");
    }

    if (!decoded) {
        res.status(400);
        throw new Error('Invalid token structure' );
    }

    req.admin = decoded;
    next();
  });
};



// authorizeRole middleware
export const authorizeRole = (requiredRole:string) => (req:Request, res:Response, next:NextFunction) => {
  if (!req.admin || !req.admin.role || !req.admin.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
  }
  next();
};
