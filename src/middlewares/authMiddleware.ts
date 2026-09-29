import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies?.username)
    res.locals.username = req.cookies?.username || null;
  else
    res.locals.username = "guest"

  next()
}

export default authMiddleware;
