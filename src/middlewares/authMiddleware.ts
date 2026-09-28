import { Request, Response, NextFunction } from "express";

const authMiddleware = (req:Request, res:Response, next:NextFunction)=>{
  res.locals.username = req.cookies?.username || null;
  next()
}

export default authMiddleware;
