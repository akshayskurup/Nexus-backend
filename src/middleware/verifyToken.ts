

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId?: string,
  role?: string
}

declare module 'express' {
    interface Request {
      user?: UserPayload; 
    }
  }

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];
console.log("Chceking");

  if (!authorizationHeader) {
    res.status(400)
    throw new Error("No token provided");
  }

  const token = authorizationHeader.split(' ')[1];  
  jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
    

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.status(401); 
      throw new Error('Token expired');
    }
    if (err) {
      console.log(err);
        res.status(400);
        throw new Error("Failed to authenticate token");
    }
    
    if (!decoded || !decoded.role) {
        res.status(400);
        throw new Error('Invalid token structure or missing role information' );
    }

    req.user = decoded;
    next();
  });
};


// authorizeRole middleware
export const authorizeRole = (requiredRole:string) => (req:Request, res:Response, next:NextFunction) => {
  if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
  }
  
  next();
};



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