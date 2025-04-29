import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.ts";

type NextFunction = express.NextFunction;
type Request = express.Request;
type Response = express.Response;

const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY!)  as jwt.JwtPayload; // Make sure JWT_KEY exists in your .env

    if (!decoded) {
      return res.status(404).json({ success: false, error: 'Token is not Valid' })
    }

    const user = await User.findById(decoded._id).select('-password')

    if (!user) {
      return res.status(404).json({success: false, error: "Token Not Found"})
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleWare;
