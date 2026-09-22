import { Request, Response, NextFunction } from "express";
import FileWorker from "../utilis/fileWorker.js";
import path from "node:path";


export const loggerMiddleware = async(req:Request,res:Response, next:NextFunction)=>{
  FileWorker.path = path.join("..", "..", "logs", "logs.txt")
  if(req.params){
    const params =JSON.stringify(req.params) 
    FileWorker.readFile(params)
  }
  if(req.params){
    const body =JSON.stringify(req.body) 
    FileWorker.readFile(body)
  }
  //res.end()
  next() // important 
}