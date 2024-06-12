

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findById } from '../helpers/userHelper';





export const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];
console.log("Chceking");

  if (!authorizationHeader) {
    res.status(400)
    throw new Error("No token provided");
  }

  const token = authorizationHeader.split(' ')[1];  
  
   jwt.verify(token, process.env.JWT_SECRET as string, async(err:any, decoded:any) => {
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
    console.log("req.user",req.user)
    const user = await findById(decoded.userId)
    if(user?.isBlocked){
      // res.status(400);
      // throw new Error('User is Blocked' );
      return res.status(400).json({ message: "User is blocked" });

    }
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