import type { NextFunction, Request, Response } from 'express';
export class AppError extends Error { constructor(public status:number, message:string){super(message);} }
export const asyncHandler=(fn:(req:Request,res:Response,next:NextFunction)=>Promise<unknown>)=>(req:Request,res:Response,next:NextFunction)=>Promise.resolve(fn(req,res,next)).catch(next);
export const page=(req:Request)=>({limit:Math.min(Math.max(Number(req.query.limit)||20,1),100),skip:Math.max(Number(req.query.offset)||0,0)});
