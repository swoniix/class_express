import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    params: req.params,
    body: req.body ?? {}
  });
  next();
};
